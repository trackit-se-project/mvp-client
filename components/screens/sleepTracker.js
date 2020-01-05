import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TextInput } from "react-native";

export default function SleepTracker({ user, changeScreen }) {
  const getDate = d => {
    const date = d ? new Date(d) : new Date();
    return (
      (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
      "/" +
      (date.getMonth() > 8
        ? date.getMonth() + 1
        : "0" + (date.getMonth() + 1)) +
      "/" +
      date.getFullYear()
    );
  };

  const fetchTotalAmount = () => {
    fetch(
      "http://192.168.0.136:3000/sleep?userId=" + user._id + "&date=" + getDate()
    )
      .then(res => res.json())
      .then(json => {
        setTotalAmount(json.totalAmount);
      })
      .catch(err => console.log(err));

    return 0;
  };

  const [totalAmount, setTotalAmount] = useState(fetchTotalAmount());

  const addAmount = (amount, date = null) => {
    fetch("http://192.168.0.136:3000/sleep", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user._id,
        date: getDate(date),
        amount: Number(amount)
      })
    })
      .then(res => res.json())
      .then(json => {
        setTotalAmount(prevTotalAmount => prevTotalAmount + json.amount);
      })
      .catch(err => console.log(err));
  };

  function Separator() {
    return <View style={styles.separator} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.banner}>Sleep Tracker</Text>
      <Text style={styles.totalAmount}>Today, you slept for {totalAmount} hours</Text>
      <View style={styles.quickAddGroup}>
        <Text style={styles.label}>Enter the amount of hours slept:</Text>
        <TextInput 
          style={styles.input}
          placeholder='e.g. 6'
          returnKeyType='done'
          onSubmitEditing={(event) => addAmount(event.nativeEvent.text)}/>
      </View>
      <Separator />
      <Separator />
      <Button title="Back" onPress={() => changeScreen("menu")}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 100
  },
  banner: {
    fontSize: 24
  },
  totalAmount: {
    fontSize: 26,
    marginTop: 100,
    marginBottom: 100
  },
  quickAddGroup: {
    marginVertical: 0
  },
  separator: {
    marginVertical: 20
  },
  input: {
    borderWidth: 2,
    borderColor: '#777',
    padding: 8,
    margin: 10,
    width: 200
  },
  label: {
    marginLeft: 10
  }
});


