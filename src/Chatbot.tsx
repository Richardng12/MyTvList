import * as React from 'react';
import ChatBot from 'react-simple-chatbot';

export default class Chatbot extends React.Component<{}>{
  render() {
    return (
      <ChatBot floating={true}
    steps={[
      {
        id: '1',
        message: 'Hello, Welcome to MyTvList!, please select one of the following options to get help',
        trigger: '2',
      },
      {
        id: '2',
        options: [
          { value: 1, label: 'About', trigger: '3' },
          { value: 2, label: 'Adding', trigger: '4' },
          { value: 3, label: 'Deleting', trigger: '5' },
          { value: 5, label: 'Searching', trigger:'7'},
          { value: 4, label: 'Editing', trigger:'6'}
        ],
      },
      {
        id: '3',
        message: 'This website lets you give reviews on your favourite shows as well as look at shows reviewed by other users!.',
        trigger: '2',
      },
      {
        id: '4',
        message: 'To review a show, click the "Add Show" button, make sure to choose a picture!',
        trigger:'2'
      },
      {
        id:'5',
        message: 'To delete your own reviews, select one of your reviews by clicking on the corresponding image,and pressing the delete button',
        trigger:'2'
      },
      {
      id:'7',
      message:'To search, either type in a corresponding tag in the search box, or click the microphone button to talk!',
      trigger:'2'
      },
      {
        id:'6',
        message:'To edit your own review, select one of your reviews by clicking the corresponding imgae, and then press edit button',
        trigger:'2'
      }
    ]}
  />
    );
  }

}