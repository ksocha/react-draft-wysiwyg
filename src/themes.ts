import { lighten, rem, rgba } from 'polished';
import type { DefaultTheme } from 'styled-components';

const defaultAccent = '#004478';

const calculateAccentHover = (accentColor: string) => lighten(0.07, accentColor);

export const defaultTheme: DefaultTheme = {
  colors: {
    main: '#092043',
    mainLighter: '#072c55',
    accent: defaultAccent,
    accentHover: calculateAccentHover(defaultAccent),
    cloudBurst: '#263c5d',
    fountainBlue: '#6eabc9',
    bermudaGray: '#7785a4',
    bermudaGrayLight: '#adb6c8',
    grayishBlue: '#b0b8c4',
    baliHai: '#8da4b6',
    botticelli: '#d8e6ee',
    aquaHaze: '#f1f5f7',
    calypso: '#2d5f7f',
    catshillWhite: '#e5eef2',
    catshillWhiteLighter: '#f2f6f9',
    halfBaked: '#83b5d0',
    cadetBlue: '#b5bcc7',
    crail: '#bb4040',
    mischka: '#d2d5dc',
    mystic: '#e3e7ef',
    anakiwa: '#a1beff',
    selago: '#eef3fc',
    mountainMeadow: '#21cf7b',
    greyLighten: '#e5e9ec',
    grey: '#c0c5c9',
    greyMid: '#919cab',
    greyDarken: '#767676',
    white: '#fff',
    black: '#000',
    pageBg: '#f8fafc',
    panelBorder: '#e5e9ec',
    panelBg: '#fff',
    textLight: '#7785a4',
    textDark: '#092043',
    buttonText: '#fff',
    lightBg: rgba('#a1beff', 0.1),
    progressLightBlue: '#739aff',
    bodyBg: '#fff',
    headerBg: '#fff',
    btn: '#fff',
    btnDefaultBg: '#fff',
    badgeDefaultBg: '#eef3fc',
    badgeDefaultText: '#7785a4',
    badgeSuccessBg: '#21cf7b',
    badgeSuccessText: '#fff',
    badgeErrorBg: '#ff6c6c',
    badgeErrorText: '#fff',
    toastInfoBg: '#eef3fc',
    toastSuccessBg: '#21cf7b',
    toastErrorBg: '#ff6c6b',
    footerSeparator: rgba('#fff', 0.3),
    subTitle: '#6eabc9',
    transparentBox: '#092043',
    sectionMark: '#ff9800',
    orangeWarning: '#f2a600',
    redDanger: '#dc314e',
    greenSuccess: '#17b267',
    metaTheme: '#182a49',
  },
  fontSizes: {
    table: rem(13),
    small: rem(14),
    smallMd: rem(16),
    smallLg: rem(18),
    mediumSm: rem(20),
    medium: rem(24),
    mediumLg: rem(32),
    bigSm: rem(48),
    big: rem(64),
    dbSmallSm: rem(10),
    dbSmallMd: rem(12),
    dbSmall: rem(13),
    dbNormalSm: rem(14),
    dbNormal: rem(15),
    dbMedium: rem(24),
    dbBigSm: rem(34),
    dbBig: rem(40),
    btn: rem(28),
    btnSm: rem(20),
  },
  fontWeights: {
    mainNormal: 400,
    mainMedium: 600,
    mainBold: 700,
    secNormal: 400,
    secBold: 700,
  },
  fontFamilies: {
    main: "'Muli', sans-serif",
    sec: "'Yrsa', serif",
  },
};

interface ThemeSettings {
  colorAccent?: string;
  colorTextDark?: string;
  colorTextLight?: string;
  colorBackground?: string;
  colorSubHeader?: string;
  colorTransparentBox?: string;
}

export const mergeThemeWithSettings = (theme: DefaultTheme, settings: ThemeSettings = {}) => {
  const newAccent = settings.colorAccent || defaultAccent;

  return {
    ...theme,
    colors: {
      ...theme.colors,
      textDark: settings.colorTextDark || defaultTheme.colors.textDark,
      textLight: settings.colorTextLight || defaultTheme.colors.textLight,
      accent: newAccent,
      accentHover: calculateAccentHover(newAccent),
      pageBg: settings.colorBackground || defaultTheme.colors.pageBg,
      subTitle: settings.colorSubHeader || defaultTheme.colors.subTitle,
      transparentBox: settings.colorTransparentBox || defaultTheme.colors.transparentBox,
    },
  };
};
