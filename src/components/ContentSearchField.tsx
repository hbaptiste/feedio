import * as React from "react";

interface ChannelFormProps {
  searchHandler: (term: string) => void;
}

export const ContentSearchField: React.FC<ChannelFormProps> = (props) => {
  const handleSearch = (event: any) => {
    if (event.target.value.length > 3) {
      props.searchHandler(event.target.value);
    }
  };
  return (
    <div>
      <input minLength={3} placeholder="Search" onChange={handleSearch} />
    </div>
  );
};
