import React, { ChangeEventHandler, useState } from "react";

interface ChannelFormProps {
  title?: String;
}

const ChannelForm: React.FC<ChannelFormProps> = () => {
  const [value, setValue] = useState<string>();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setValue(event?.target?.value);
  };
  const onSave = () => {
    alert(value);
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
