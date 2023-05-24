import { FC } from 'react';

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: FC<MainContentProps> = ({ children }) => {
  return <main>{children}</main>;
};

export default MainContent;
