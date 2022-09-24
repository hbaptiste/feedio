import React, { ChangeEventHandler, useState } from "react";
import { createChannel } from "./services/channels";

import { newChannel } from "./features/channelsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { updateCurrentView } from "./features/globalSlice";


interface ChannelFormProps {
  title?: String;
}

const ChannelForm: React.FC<ChannelFormProps> = () => {
  const [value, setValue] = useState<string>();
  // app dispatacher
  const dispatch = useAppDispatch();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event?.target?.value);
  };
  const onSave = () => {
    if (!value) { return }
    createChannel(value).then(async (channel) => {
      dispatch(newChannel(channel))
      dispatch(updateCurrentView("userList"))
    })
  };

  return (
    <div className="channelForm">
      <p className="field">Channel Name</p>
      <input onChange={onChange} type="text" defaultValue={value} />
      <input onClick={onSave} type="button" value="save" />
    </div>
  );
};

export default ChannelForm;
