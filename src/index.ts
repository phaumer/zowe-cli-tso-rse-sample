/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import {
  IProfile,
  Session,
  Logger,
  LoggingConfigurer,
  ImperativeError,
} from '@zowe/imperative';
import { ZosmfSession } from '@zowe/zosmf-for-zowe-sdk';
import { getDefaultProfile } from '@zowe/core-for-zowe-sdk';
import { IssueTso } from '@zowe/zos-tso-for-zowe-sdk';
import { RseRestSession, IssueCommand } from '@ibm/rse-api-for-zowe-cli';
import * as process from 'process';

let apiOption = process.argv[2];
if (!apiOption) {
  apiOption = '-rse';
}

(async () => {
  //Initialize the Imperative Credential Manager Factory and Logger
  Logger.initLogger(LoggingConfigurer.configureLogger('lib', { name: 'test' }));
  // Uncommment the below line if the Secure Credential Store is in use
  // await CredentialManagerFactory.initialize({service: "Zowe-Plugin"});

  // Get the default z/OSMF profile and create a z/OSMF session with it
  let defaultApiProfile: IProfile;
  let session: Session;
  const command = 'status';
  let response: any;

  if (apiOption === '-zosmf') {
    let defaultTsoProfile: IProfile;
    try {
      defaultApiProfile = await getDefaultProfile('zosmf', true);
      defaultTsoProfile = await getDefaultProfile('tso', false);
    } catch (err) {
      throw new ImperativeError({ msg: 'Failed to get a profile.' });
    }

    session = ZosmfSession.createBasicZosmfSession(defaultApiProfile);
    const accountNumber = defaultTsoProfile.account;
    response = await IssueTso.issueTsoCommand(
      session,
      accountNumber,
      command
    );

  } else if (apiOption === '-rse') {
    try {
      defaultApiProfile = await getDefaultProfile('rse', true);
    } catch (err) {
      throw new ImperativeError({ msg: 'Failed to get a profile.' });
    }
    session = RseRestSession.createBasicRestSession(defaultApiProfile);
    response = await IssueCommand.tsoCommand(session, command);
  }

  if (response.success) {
    console.log(response);
  } else {
    throw new Error(`Failed to issue TSO command "${command}"`);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
