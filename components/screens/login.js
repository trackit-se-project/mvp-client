import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";

export default function Login({ getUser, changeScreen }) {
  const [credentials, setCredentials] = useState({
    email: "",
    pass: ""
  });

  const [errMsg, setErrMsg] = useState({
    show: false,
    msg: ""
  });

  const setEmail = text => {
    setCredentials(prevCredentials => {
      return {
        email: text,
        pass: prevCredentials["pass"]
      };
    });
  };

  const setPassword = text => {
    setCredentials(prevCredentials => {
      return {
        email: prevCredentials["email"],
        pass: text
      };
    });
  };

  const auth = () => {
    fetch("http://192.168.0.136:3000/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: credentials["email"],
        pass: credentials["pass"]
      })
    })
      .then(res => res.json())
      .then(json => {
        if (json["_id"]) {
          setErrMsg(prevErrMsg => {
            return { show: false, msg: "" };
          });

          getUser(json);
        } else if (json["msg"]) {
          setErrMsg(prevErrMsg => {
            return { show: true, msg: json["msg"] };
          });
        }
      })
      .catch(err =>
        setErrMsg(prevErrMsg => {
          return { show: true, msg: err };
        })
      );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.banner}>Track it!</Text>
      <Text style={styles.bannerSmall}>Log into your tracker</Text>
      {errMsg["show"] && <Text style={styles.errMsg}>{errMsg["msg"]}</Text>}
      <Text style={styles.inputLabel}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setEmail(text)}
        value={credentials["email"]}
      />
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setPassword(text)}
        value={credentials["pass"]}
      />
      <Button title="Login" onPress={() => auth()}></Button>
      <Text style={styles.registerText}>Don't have an account?</Text>
      <Button
        title="Register"
        onPress={() => changeScreen("register")}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 100
  },
  banner: {
    fontSize: 36
  },
  bannerSmall: {
    fontSize: 24,
    marginBottom: 100
  },
  errMsg: {
    width: 300,
    color: "red",
    fontSize: 18,
    textAlign: "left",
    marginBottom: 30
  },
  inputLabel: {
    width: 300,
    fontSize: 18,
    textAlign: "left"
  },
  input: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
    width: 300,
    padding: 10,
    margin: 10,
    marginBottom: 30
  },
  registerText: {
    fontSize: 18,
    marginTop: 50,
    marginBottom: 10
  }
});
