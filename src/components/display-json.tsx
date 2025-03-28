"use client";

import React, { useEffect } from "react";

import { format as prettyFormat } from "pretty-format";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  consoleLog?: boolean;
  consoleTitle?: string;
  json: string | object | unknown;
  options?: {
    compareKeys?: (_a: string, _b: string) => number;
    escapeString?: boolean;
    maxDepth?: number;
    maxWidth?: number;
    min?: boolean;
    printBasicPrototype?: boolean;
    printFunctionName?: boolean;
  };
}

const defaultOptions = {
  printBasicPrototype: false,
  printFunctionName: false,
};

function DisplayJSON({ consoleLog, consoleTitle, json, options: optionsProp }: Props) {
  const options = { ...defaultOptions, ...optionsProp };

  useEffect(() => {
    if (!!consoleTitle || consoleLog) {
      console.group(consoleTitle ? `DisplayJSON: ${consoleTitle}` : "DisplayJSON");
      console.log(json);
      console.groupEnd();
    }
  }, [consoleLog, consoleTitle, json]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prettyFormat(json, options)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    fontVariant: ["tabular-nums"],
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});

export default DisplayJSON;
