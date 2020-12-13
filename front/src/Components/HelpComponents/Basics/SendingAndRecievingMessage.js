import React from "react";

const SendingAndReceivingMessages = () => {
  return (
    <div>
      <div>
        <h2>Sending And Receiving Messages</h2>
      </div>
      <div className="mt-3">
        <span className="heading">Messaging An Ad</span>
        <ol>
          <li>Open the ad you're interested in.</li>
          <li>Type your message into the message box.</li>
          <li>
            When you’re finished, click <b>Send message</b>.
          </li>
        </ol>
        <p>
          To see all of your open conversations, click on the dropdown menu and
          select Inbox.
        </p>
      </div>
      <div>
        <span className="heading">Receiving and Responding to Replies</span>
        <p>When someone replies to you, you’ll get a notification.</p>
        <span>To respond:</span>
        <ol>
          <li>Click Inbox from the dropdown menu.</li>
          <li>
            Click on the conversation you want. You should see the entire
            history of your messages back and forth. To see more, scroll up.
          </li>
          <li>Type your message into the message box.</li>
          <li>When you’re finished, click the send button.</li>
        </ol>
      </div>
      <div>
        <span className="heading">Deleting Conversations</span>
        <ol>
          <li>Click Inbox from the dropdown menu.</li>
          <li>
            Click on the delete icon in the conversation you want to delete. You
            should be asked confirmation to delete the conversation.
          </li>
          <li>
            Click <b>Yes, Delete it!</b>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default SendingAndReceivingMessages;
