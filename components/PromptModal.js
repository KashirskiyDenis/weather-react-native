import { useEffect, useRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import {
  COLOR_BUTTON_PRESSED,
  COLOR_PLACEHOLDER,
} from "../constants/modalColors";
import modalStyles from "../styles/modalStyles";

function PromptModal({ visible, onClose, text, onChangeText, onSubmit }) {
  const inputRef = useRef(null);

  useEffect(() => {
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      if (visible) {
        inputRef.current?.blur();
      }
    });

    return () => {
      hideSubscription.remove();
    };
  }, [visible]);

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
      <KeyboardAvoidingView behavior="padding" style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalTextBlock}>
            <Text style={modalStyles.modalTextTitle}>Изменить локацию</Text>
            <TextInput
              ref={inputRef}
              style={modalStyles.modalTextInput}
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
          <View style={modalStyles.modalButtonBlock}>
            <TouchableHighlight
              underlayColor={COLOR_BUTTON_PRESSED}
              style={modalStyles.modalButton}
              onPress={onClose}
            >
              <Text style={modalStyles.modalButtonText}>ОТМЕНА</Text>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={COLOR_BUTTON_PRESSED}
              style={modalStyles.modalButton}
              onPress={onSubmit}
            >
              <Text style={modalStyles.modalButtonText}>ИЗМЕНИТЬ</Text>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default PromptModal;
