import { FC } from 'react';
import MainContent from '../components/ui/MainContent';

const AboutPage: FC = () => {
  return (
    <MainContent>
      <div className="about">
        <p>
          This web application allows you to search repositories on GitHub. You can customize the
          way requests are sent by choosing between REST API and GraphQL API. Additionally, you can
          adjust the response time when entering search queries and modify the number of displayed
          items per page. The application also provides the option to authenticate using your GitHub
          account. Customize the settings according to your preferences and easily find the
          repositories you need on GitHub.
        </p>
        <label>This app was built with:</label>
        <ul>
          <li>Typescript</li>
          <li>React</li>
          <li>Redux Toolkit</li>
          <li>React Router Dom</li>
          <li>Graphql-request</li>
          <li>Firebase</li>
          <li>dayjs</li>
          <li>react hot toast</li>
          <li>SCSS</li>
          <li>EsLint & Prettier</li>
        </ul>
      </div>
    </MainContent>
  );
};

export default AboutPage;
