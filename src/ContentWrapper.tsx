import React from "react";

interface Props {
  type: string;
  mode: string;
  data: any;
}

//display the list of contents
export const ContentWrapper: React.FC<Props> = () => {
  return (
    <div>
      <p>My wrapper control every content</p>
    </div>
  );
};
