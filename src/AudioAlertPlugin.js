import React from 'react';
import { VERSION } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';

import CustomTaskListContainer from './components/CustomTaskList/CustomTaskList.Container';
import reducers, { namespace } from './states';

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

    const incomingTaskSound = new Audio("https://quartz-ram-3050.twil.io/assets/multimedia_alert_006_46195.mp3");
    incomingTaskSound.loop = false;
    
    const resStatus = ["accepted","canceled","rejected","rescinded","timeout"];
    
    manager.workerClient.on("reservationCreated", function(reservation) {
      if (reservation.task.taskChannelUniqueName === 'voice' && reservation.task.attributes.Direction === 'inbound') {
        incomingTaskSound.play();
        console.log("task.attributes: " + reservation.task.attributes )
      }
      resStatus.forEach((e) => {
        reservation.on(e, () => {
          incomingTaskSound.pause()
        });
      });
    });

    const options = { sortOrder: -1 };
    flex.AgentDesktopView.Panel1.Content.add(<CustomTaskListContainer key="demo-component" />, options);
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

    manager.store.addReducer(namespace, reducers);
  }
}
