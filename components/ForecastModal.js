import {
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { COLOR_BUTTON_PRESSED } from "../constants/modalColors";
import modalStyles from "../styles/modalStyles";

function ForecastModal({ visible, onClose, forecast }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <View style={modalStyles.modalTextBlock}>
            <Text style={modalStyles.modalTextTitle}>
              Прогноз на {forecast?.date} {forecast?.description}
            </Text>
            <View>
              <Text style={modalStyles.modalTextMessage}>
                Осадки:{" "}
                {forecast?.rain && forecast?.snow
                  ? `дождь ${forecast.rain} мм, снег ${forecast.snow} мм`
                  : forecast?.rain
                    ? `дождь ${forecast.rain} мм`
                    : forecast?.snow
                      ? `снег ${forecast.snow} мм`
                      : "-"}
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Облачность: {forecast?.clouds} %
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Влажность: {forecast?.humidity} %
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Давление: {forecast?.pressure} мм рт.ст.
              </Text>
              <Text style={[modalStyles.modalTextMessage, styles.titleSection]}>
                ТЕМПЕРАТУРА
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Максимум/минимум: {forecast?.tempMax ?? "-"}° /{" "}
                {forecast?.tempMin ?? "-"}°
              </Text>
              <View style={styles.flexBlock}>
                <View style={styles.flexElement}>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    Ночью{"\n"}в 00.00
                  </Text>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    {forecast?.tempNight ?? "-"}°C
                  </Text>
                </View>
                <View style={ыtyles.flexElement}>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    Утром{"\n"}в 06.00
                  </Text>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    {forecast?.tempMorn ?? "-"}°C
                  </Text>
                </View>
                <View style={styles.flexElement}>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    Днём{"\n"}в 12.00
                  </Text>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    {forecast?.tempDay ?? "-"}°C
                  </Text>
                </View>
                <View style={styles.flexElement}>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    Вечером{"\n"}в 18.00
                  </Text>
                  <Text
                    style={[modalStyles.modalTextMessage, styles.textCenter]}
                  >
                    {forecast?.tempEve ?? "-"}°C
                  </Text>
                </View>
              </View>
              <Text style={[modalStyles.modalTextMessage, styles.titleSection]}>
                ВЕТЕР
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Направление ветра: {forecast?.deg ?? "-"}
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Скорость ветра: {forecast?.speed ?? "-"} м/с
              </Text>
              <Text style={modalStyles.modalTextMessage}>
                Порывы ветра: {forecast?.gust ?? "-"} м/с
              </Text>
            </View>
          </View>
          <View style={modalStyles.modalButtonBlock}>
            <TouchableHighlight
              underlayColor={COLOR_BUTTON_PRESSED}
              style={modalStyles.modalButton}
              onPress={onClose}
            >
              <Text style={modalStyles.modalButtonText}>ОТМЕНА</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flexBlock: {
    flexDirection: "row",
    justifyContent: "center",
  },
  flexElement: { flex: 1, textAlign: "center" },
  textCenter: {
    textAlign: "center",
  },
  titleSection: {
    paddingTop: 8,
  },
});

export default ForecastModal;
