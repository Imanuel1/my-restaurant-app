"use client";

import React, {
  Fragment,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Cloud,
  fetchSimpleIcons,
  ICloud,
  renderSimpleIcon,
  SimpleIcon,
} from "react-icon-cloud";
import banana from "../../assets/images/banana.svg";
import bread from "../../assets/images/bread.svg";
import cake from "../../assets/images/cake.svg";
import cheese from "../../assets/images/cheese.svg";
import chips from "../../assets/images/chips.svg";
import donut from "../../assets/images/donut.svg";
import hotdog from "../../assets/images/hotdog.svg";
import humburger from "../../assets/images/humburger.svg";
import icecream from "../../assets/images/ice-cream.svg";
import meat from "../../assets/images/meat-on-bone.svg";
import noodles from "../../assets/images/noodles.svg";
import piza from "../../assets/images/piza.svg";
import salad from "../../assets/images/salad.svg";
import sandwitch from "../../assets/images/sandwitch.svg";
import watermelon from "../../assets/images/water-melon.svg";

export const cloudProps: Omit<ICloud, "children"> = {
  containerProps: {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      paddingTop: 40,
    },
  },
  options: {
    reverse: true,
    depth: 1,
    wheelZoom: false,
    imageScale: 2,
    activeCursor: "default",
    tooltip: "native",
    initial: [0.1, -0.1],
    clickToFront: 500,
    tooltipDelay: 0,
    outlineColour: "#0000",
    maxSpeed: 0.04,
    minSpeed: 0.02,
    // dragControl: false,
  },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

export type DynamicCloudProps = {
  iconSlugs: string[];
};

type IconData = Awaited<ReturnType<typeof fetchSimpleIcons>>;

function IconCloud({ iconSlugs }: DynamicCloudProps) {
  const [data, setData] = useState<IconData | null>(null);

  useEffect(() => {
    fetchSimpleIcons({ slugs: iconSlugs }).then((res) => {
      console.log("this is res icons", res);

      setData(res);
    });
  }, [iconSlugs]);

  const renderedIcons = useMemo(() => {
    if (!data) return null;

    return Object.values(data.simpleIcons).map((icon) =>
      renderCustomIcon(icon, "light")
    );
  }, [data]);

  return (
    // @ts-ignore
    <Cloud {...cloudProps}>
      <Fragment></Fragment>
      {renderedIcons}
    </Cloud>
  );
}

export const renderSvgIcon = (icon: string, theme: string) => {
  const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
  const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
  const minContrastRatio = theme === "dark" ? 2 : 1.2;

  return renderSimpleIcon({
    icon,
    bgHex,
    fallbackHex,
    minContrastRatio,
    size: 42,
    aProps: {
      href: undefined,
      target: undefined,
      rel: undefined,
      onClick: (e: any) => e.preventDefault(),
    },
  });
};

function CustomIconCloud() {
  const icons = [
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
    {
      hex: "#EFD358",
      path: banana,
      title: "baana",
      slug: "banana",
    } as SimpleIcon,
  ].map((icon, index) => {
    return renderSimpleIcon({
      icon,
      size: 42,
      aProps: {
        onClick: (e: any) => e.preventDefault(),
      },
    });
  });
  return (
    <Cloud {...cloudProps}>
      <Fragment></Fragment>
      {icons}
    </Cloud>
  );
}

export { CustomIconCloud, IconCloud };
