import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'styled-components';
import { Normalize } from 'styled-normalize';

import Editor from './Editor';
import messages from './i18n';
import { defaultTheme } from './themes';

interface Messages {
  [key: string]: string | Messages;
}

// https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
export function flattenMessages(nestedMessages: Messages, prefix = '') {
  return Object.keys(nestedMessages).reduce<{ [key: string]: string }>((mess, key) => {
    const value = nestedMessages[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      // eslint-disable-next-line no-param-reassign
      mess[prefixedKey] = value;
    } else {
      Object.assign(mess, flattenMessages(value, prefixedKey));
    }

    return mess;
  }, {});
}

const App: React.FC = () => {
  const languageSpecificMessages = useMemo(() => flattenMessages(messages), []);

  return (
    <IntlProvider defaultLocale="en-GB" locale="en-GB" messages={languageSpecificMessages}>
      <ThemeProvider theme={defaultTheme}>
        <Normalize />

        <Editor />
      </ThemeProvider>
    </IntlProvider>
  );
};

ReactDOM.render(<App />, document.querySelector('body'));
