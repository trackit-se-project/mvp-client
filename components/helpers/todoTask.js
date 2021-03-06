import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Icon, CheckBox, Body } from "native-base";

import LOCAL_IP from "../../ipconfig";

export default function TodoTask({ todo }) {
  const [errMsg, setErrMsg] = useState({
    show: false,
    msg: ""
  });

  const [checked, setChecked] = useState(todo.checked);

  const onDelete = () => {
    fetch(`${LOCAL_IP}/todos/${todo._id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
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

  const onUpdate = () => {
    fetch(`${LOCAL_IP}/todos/${todo._id}`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        checked: !checked
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
    <View style={styles.row}>
      <View style={styles.element}>
        <TouchableOpacity
          onPress={() => {
            setChecked(!checked);
            onUpdate();
          }}
          style={styles.touchableItem}
        >
          <CheckBox
            checked={checked}
            onPress={() => {
              setChecked(!checked);
              onUpdate();
            }}
          />
          <Body style={styles.body}>
            <Text
              style={{
                color: checked ? "grey" : "black",
                textDecorationLine: checked ? "line-through" : "none"
              }}
            >
              {todo.taskName}
            </Text>
          </Body>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete()}>
          <Icon
            name="trash"
            color={`${todo.taskName.length > 0 ? "black" : "grey"}`}
            size={23}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "flex-start",
    paddingLeft: 25
  },
  element: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5
  },
  touchableItem: {
    flex: 1,
    width: "100%",
    flexDirection: "row"
  }
});
