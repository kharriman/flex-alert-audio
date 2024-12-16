import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

// import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
// import reducers, { namespace } from './states';

const PLUGIN_NAME = 'AudioAlertPlugin';

export default class AudioAlertPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {
    this.registerReducers(manager);

    // Matt's version:

    // const incomingTaskSound = new Audio("https://quartz-ram-3050.twil.io/assets/multimedia_alert_006_46195.mp3")
    // manager.workerClient.on('reservationCreated', async ({task}: {task?:ITask}) => {
    //     try {
    //         incomingTaskSound.play();
    //     }
    //     catch(e) {
    //         console.debug(e)
    //     }
    // })

    const incomingTaskSound = new Audio("https://perceptioniststorage.blob.core.windows.net/notifications/officephone.mp3");
    const incomingPreviewDialerSound = new Audio("https://perceptioniststorage.blob.core.windows.net/notifications/notification5.wav");
    const incomingSMSSound = new Audio("https://perceptioniststorage.blob.core.windows.net/notifications/smsChime.mp3");
    const incomingChatSound = new Audio("https://perceptioniststorage.blob.core.windows.net/notifications/chime.wav");
    incomingTaskSound.loop = true;
    
    const resStatus = ["accepted","canceled","rejected","rescinded","timeout"];
    
    manager.workerClient.on("reservationCreated", function(reservation) {
      if (reservation.task.taskChannelUniqueName === 'voice' && reservation.task.attributes.direction === 'inbound') {
        incomingTaskSound.play();
      }
      else if(reservation.task.taskChannelUniqueName === 'previewdialer'){
        incomingPreviewDialerSound.play();
      }
      else if(reservation.task.taskChannelUniqueName === 'chat'){
        incomingChatSound.play();
      }
      else if(reservation.task.taskChannelUniqueName === 'sms'){
        incomingSMSSound.play();
      }
      resStatus.forEach((e) => {
        reservation.on(e, () => {
          incomingTaskSound.pause()
          incomingPreviewDialerSound.pause()
          incomingChatSound.pause()
          incomingChatSound.pause()
        });
      });
    });

    const options = { sortOrder: -1 };
    // flex.AgentDesktopView.Panel1.Content.add(<CustomTaskListContainer key="demo-component" />, options);
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    // manager.store.addReducer(namespace, reducers);
  }
}
