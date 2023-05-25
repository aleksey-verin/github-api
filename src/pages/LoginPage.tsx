import { FC } from 'react';
import MainContent from '../components/ui/MainContent';

interface LoginPageProps {}

const LoginPage: FC<LoginPageProps> = () => {
  // const handleAuth = async () => {
  //   try {
  //     const response = await fetch('https://github.com/login/oauth/authorize?scope=user:e');
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log(data);
  //     return data;
  //   } else {
  //     const error = await response.json();
  //     console.log(error);
  //   }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return (
    <MainContent>
      <div>Auth with GitHub</div>
      <button>Click</button>
    </MainContent>
  );
};

export default LoginPage;
