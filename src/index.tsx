import React from 'react';
import ReactDom from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { LocaleProvider } from 'antd';
import koKR from 'antd/lib/locale-provider/ko_KR';
import enUS from 'antd/lib/locale-provider/en_US';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import App from './App';
import ShowPage from './ShowPage';
import { register } from './serviceWorker';
import i18next from 'i18next';
import { i18nClient } from './i18n';
import './index.less';
import './style.less';
import {
	createBrowserRouter,
	RouterProvider,
	BrowserRouter,
	HashRouter,
	Route,
	Link,
	createHashRouter,
  } from "react-router-dom";
const antResources = {
	cn:zhCN,
	ko: koKR,
	'ko-KR': koKR,
	en: enUS,
	'en-US': enUS,
};
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);
const router = createHashRouter([
	{
	  path: "/",
	  element: <App />,
	},
	{
	  path: "/showPage",
	  element: <ShowPage />,
	},
  ]);
// const render = Component => {
// 	const rootElement = document.getElementById('root');
// 	ReactDom.render(
// 		<AppContainer>
// 			
// 		</AppContainer>,
// 		rootElement,
// 	);
// };

const render = Component => {
	const rootElement = document.getElementById('root');
	ReactDom.render(
		<RouterProvider router={router} ></RouterProvider>,
		rootElement,
	);
};

const lang = i18nClient();

render(App);

register();

if (module.hot) {
	module.hot.accept('./App', () => {
		render(App);
	});
}
