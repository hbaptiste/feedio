import React, { ChangeEventHandler, useState } from "react";

import { newChannel } from "./features/channelsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { useNavigate } from "react-router-dom";

interface ChannelFormProps {
  title?: String;
}

const ChannelForm: React.FC<ChannelFormProps> = () => {
  const [value, setValue] = useState<string>();
  const [isProtected, setIsProtected] = useState<boolean>(false);
  // app dispatacher
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // getCurrentUser
  const user = useAppSelector((state) => state.global.user);

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event?.target?.value);
  };

  const onSave = () => {
    if (!value || user == null) {
      return;
    }
    dispatch(newChannel({ name: value, user, isProtected }));
    navigate("/");
  };

  return (
    <div className="channelForm">
      <p className="field">Channel Name</p>
      <input onChange={onChange} type="text" defaultValue={value} />
      <label>Protected</label>
      <input type="checkbox" defaultChecked={isProtected} />
      <input onClick={onSave} type="button" value="save" />
    </div>
  );
};

export default ChannelForm;
