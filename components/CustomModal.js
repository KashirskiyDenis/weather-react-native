import {
  KeyboardAvoidingView,
  Modal,
  PlatformColor,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';

function CustomModal({ visible, onClose, text, onChangeText, onSubmit }) {
  return (
    <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}>
    <KeyboardAvoidingView behavior="height" style={styles.centeredView}>
    <View style={styles.modalView}>
    <View style={styles.modalTextBlock}>
    <Text style={styles.modalTextTitle}>Изменить локацию</Text>
    <TextInput
    style={styles.modalTextInput}
    placeholder="Название города"
    placeholderTextColor="#9e9e9e"
    onChangeText={onChangeText}
    value={text}
    />
    </View>
    <View style={styles.modalButtonBlock}>
    <TouchableHighlight
    underlayColor="#dddddd"
    style={styles.modalButton}
    onPress={onClose}>
    <Text style={styles.modalButtonText}>ОТМЕНА</Text>
    </TouchableHighlight>
    <TouchableHighlight
    underlayColor="#dddddd"
    style={styles.modalButton}
    onPress={onSubmit}>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000bb',
  },
  modalView: {
    width: '87.5%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  modalTextBlock: {
    padding: 24,
    // borderWidth: 1,
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: '500',
    paddingBottom: 20,
    color: PlatformColor('@android:color/system_surface_container_dark', '#212121'),
                                 // borderWidth: 1,
  },
  modalTextInput: {
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: PlatformColor('?attr/colorAccent'),
                                 // borderWidth: 1,
  },
  modalButtonBlock: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    // borderWidth: 1,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 2,
    // borderWidth: 1,
  },
  modalButtonText: {
    color: PlatformColor('?attr/colorAccent'),
                                 fontWeight: '500',
  },
});

export default CustomModal;
