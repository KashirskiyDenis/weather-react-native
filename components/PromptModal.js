import { useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PlatformColor,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";

const COLOR_BACKGROUND = PlatformColor
  ? PlatformColor("?attr/colorBackground")
  : "#ffffff";
const COLOR_TEXT = "#212121";
const COLOR_PLACEHOLDER = "#757575";
const COLOR_ACCENT = PlatformColor
  ? PlatformColor("?attr/colorAccent")
  : "#ff0000";
const COLOR_BUTTON_PRESSED = "#e0e0e0";
const COLOR_SCRIM = "rgba(0, 0, 0, 0.6)";

function PromptModal({ visible, onClose, text, onChangeText, onSubmit }) {
  const inputRef = useRef(null);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onShow={() => {
        inputRef.current?.focus();
      }}
    >
      <KeyboardAvoidingView behavior="height" style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalTextBlock}>
            <Text style={styles.modalTextTitle}>Изменить локацию</Text>
            <TextInput
              ref={inputRef}
              style={styles.modalTextInput}
              placeholder="Название города"
              placeholderTextColor={COLOR_PLACEHOLDER}
              onChangeText={onChangeText}
              value={text}
              returnKeyType="done"
              submitBehavior="submit"
              onSubmitEditing={() => {
                if (!text.trim()) return;

                onSubmit();
                Keyboard.dismiss();
              }}
            />
          </View>
          <View style={styles.modalButtonBlock}>
            <TouchableHighlight
              underlayColor={COLOR_BUTTON_PRESSED}
              style={styles.modalButton}
              onPress={onClose}
            >
              <Text style={styles.modalButtonText}>ОТМЕНА</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={COLOR_BUTTON_PRESSED}
              style={styles.modalButton}
              onPress={onSubmit}
            >
              <Text style={styles.modalButtonText}>ИЗМЕНИТЬ</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_SCRIM,
  },
  modalView: {
    width: "87.5%",
    backgroundColor: COLOR_BACKGROUND,
    borderRadius: 2,
  },
  modalTextBlock: {
    padding: 24,
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: COLOR_TEXT,
    paddingBottom: 20,
  },
  modalTextInput: {
    fontSize: 14,
    color: COLOR_TEXT,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_ACCENT,
  },
  modalButtonBlock: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 2,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: COLOR_ACCENT,
  },
});

export default PromptModal;
