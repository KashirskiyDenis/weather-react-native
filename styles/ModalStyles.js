import { StyleSheet } from "react-native";
import { COLOR_ACCENT, COLOR_BACKGROUND, COLOR_SCRIM, COLOR_TEXT } from "../constants/ModalColors";

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_SCRIM,
  },
  modalView: {
    width: '87.5%',
    backgroundColor: COLOR_BACKGROUND,
    borderRadius: 2,
  },
  modalTextBlock: {
    padding: 24,
  },
  modalTextTitle: {
    fontSize: 20,
    fontWeight: '500',
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
  modalTextMessage: {
    fontSize: 14,
    color: COLOR_TEXT,
  },  
  modalButtonBlock: {
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 2,
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLOR_ACCENT,
  },
});

export default modalStyles;