/**
 * Copyright 2019 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {loadScript, validateData} from '../3p/3p';

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function vidoomy(global, data) {
  const mandatoryAttributes = ['pid', 'sid'];
  const optionalAttributes = ['xtra-lkqd-settings'];

  validateData(data, mandatoryAttributes, optionalAttributes);

  let lkqdStartObject = {
    pid: 430,
    sid: 690712, //
    playerContainerId: 'ad',
    playerId: 'vidoomy',
    playerWidth: 180,
    playerHeight: 100,
    execution: 'outstream',
    placement: 'slider',
    playInitiation: 'auto',
    slidePosition: 'right',
    volume: 0,
    trackImp: '',
    trackClick: '',
    custom1: '',
    custom2: '',
    custom3: '',
    pubMacros: '',
    overrideSize: true,
    dfp: true,
    close: false,
    gdpr: '',
    gdprcs: '',
    bottomPadding: 100,
    lkqdId: new Date().getTime().toString() + Math.round(Math.random()*1000000000).toString(),
    supplyContentVideo: {
        url: '', clickurl: '', play: 'post'
    }
  };

  lkqdStartObject = Object.assign(data['start-lkqd-settings'] || {}, lkqdStartObject);

  const pid = data.pid || 430;
  const sid = data.sid || 690712;

  // pid && sid attrs should be mandatory, so we assign it after the object extension
  lkqdStartObject.pid = pid;
  lkqdStartObject.sid = sid;

  launchLKQD(lkqdStartObject, global);
 // addIframe(global);
}

function addIframe(w) {
  var d = w.document;
  var iframe = d.createElement('iframe');
  iframe.src = 'https://www.vidoomy.com/tests/amp-iframe/vidoomy-iframe.html';
  d.querySelector('#c').appendChild(iframe);
}

function launchLKQD(lkqdSettings, w) {
          
  var d = w.document;
  var lkqdVPAID;
  var creativeData = '';
  var environmentVars = { slot: d.getElementById(lkqdSettings.playerContainerId), videoSlot: d.getElementById(lkqdSettings.playerId), videoSlotCanAutoPlay: true, lkqdSettings: lkqdSettings };

  function onVPAIDLoad()
  {
    lkqdVPAID.subscribe(function() { 
      console.log('adloaded');
        lkqdVPAID.startAd(); 
    }, 'AdLoaded');
    lkqdVPAID.subscribe(function() { setTimeout(function () {
      console.log('AdVideoStart');

      }, 100); }, 'AdVideoStart');
    lkqdVPAID.subscribe(function() { 
      console.log('AdStopped');
      
    }, 'AdStopped');
  }
  //<iframe id="ad-iframe" src="https://www.vidoomy.com/tests/amp-iframe/vidoomy-iframe.html" style="z-index: 9999999999; width: 250px; height: 171px!important; bottom: 10px; right: 10px;" frameborder="0"></iframe>

  var playerContainer = d.createElement('div');
  playerContainer.id = lkqdSettings.playerContainerId;
  playerContainer.name = lkqdSettings.playerContainerId;

  var player = d.createElement('div');
  player.id = lkqdSettings.playerId;
  player.name = lkqdSettings.playerId;

  playerContainer.appendChild(player);

  d.documentElement.appendChild(playerContainer);


  var vpaidFrame = d.createElement('iframe');
  vpaidFrame.id = lkqdSettings.lkqdId;
  vpaidFrame.name = lkqdSettings.lkqdId;
  vpaidFrame.style.display = 'none';
  var vpaidFrameLoaded = function() {
    vpaidFrame.contentWindow.addEventListener('lkqdFormatsLoad', function() {
      console.log('lkqdFormatsLoad');
      lkqdVPAID = vpaidFrame.contentWindow.getVPAIDAd();
      onVPAIDLoad();
      lkqdVPAID.handshakeVersion('2.0');
      lkqdVPAID.initAd(lkqdSettings.playerWidth, lkqdSettings.playerHeight, 'normal', 600, creativeData, environmentVars);
    });
    const vpaidLoader = vpaidFrame.contentWindow.document.createElement('script');
    vpaidLoader.setAttribute('async','async');
    vpaidLoader.src = 'https://ad.lkqd.net/vpaid/formats.js';
    vpaidFrame.contentWindow.document.body.appendChild(vpaidLoader);
  };
  vpaidFrame.onload = vpaidFrameLoaded;
  vpaidFrame.onerror = vpaidFrameLoaded;
  d.documentElement.appendChild(vpaidFrame);
}