import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      main: string;
      mainLighter: string;
      accent: string;
      accentHover: string;
      cloudBurst: string;
      fountainBlue: string;
      bermudaGray: string;
      bermudaGrayLight: string;
      grayishBlue: string;
      baliHai: string;
      botticelli: string;
      aquaHaze: string;
      calypso: string;
      catshillWhite: string;
      catshillWhiteLighter: string;
      halfBaked: string;
      cadetBlue: string;
      crail: string;
      mischka: string;
      mystic: string;
      anakiwa: string;
      selago: string;
      mountainMeadow: string;
      greyLighten: string;
      grey: string;
      greyMid: string;
      greyDarken: string;
      white: string;
      black: string;
      pageBg: string;
      panelBorder: string;
      panelBg: string;
      textLight: string;
      textDark: string;
      buttonText: string;
      lightBg: string;
      progressLightBlue: string;
      bodyBg: string;
      headerBg: string;
      btn: string;
      btnDefaultBg: string;
      badgeDefaultBg: string;
      badgeDefaultText: string;
      badgeSuccessBg: string;
      badgeSuccessText: string;
      badgeErrorBg: string;
      badgeErrorText: string;
      toastInfoBg: string;
      toastSuccessBg: string;
      toastErrorBg: string;
      footerSeparator: string;
      subTitle: string;
      transparentBox: string;
      sectionMark: string;
      orangeWarning: string;
      redDanger: string;
      greenSuccess: string;
      metaTheme: string;
    };
    fontSizes: {
      table: string;
      small: string;
      smallMd: string;
      smallLg: string;
      mediumSm: string;
      medium: string;
      mediumLg: string;
      bigSm: string;
      big: string;
      dbSmallSm: string;
      dbSmallMd: string;
      dbSmall: string;
      dbNormalSm: string;
      dbNormal: string;
      dbMedium: string;
      dbBigSm: string;
      dbBig: string;
      btn: string;
      btnSm: string;
    };
    fontWeights: {
      mainNormal: number;
      mainMedium: number;
      mainBold: number;
      secNormal: number;
      secBold: number;
    };
    fontFamilies: {
      main: string;
      sec: string;
    };
  }

  export type PolymorphicComponent = keyof JSX.IntrinsicElements | React.ComponentType<any>;
}
