// Speech to Text Conversion in React Native – Voice Recognition
// https://aboutreact.com/speech-to-text-conversion-in-react-native-voice-recognition/

// import React in our code
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';

// import Voice
import Voice from 'react-native-voice';

const screenWidth = Dimensions.get('window').width;
let rec_switch = false;
let rec_result = [];


const App = () => {
  const [pitch, setPitch] = useState('');
  const [error, setError] = useState('');
  const [end, setEnd] = useState('');
  const [started, setStarted] = useState('');
  const [results, setResults] = useState([]);
  const [partialResults, setPartialResults] = useState([]);
  const [isChecked, setIsChecked] = useState({})


  useEffect(() => {
    //Setting callbacks for the process status
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechPartialResults = onSpeechPartialResults;
    Voice.onSpeechVolumeChanged = onSpeechVolumeChanged;

    return () => {
      //destroy the process after switching the screen
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);


  const onSpeechStart = (e) => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
    setStarted('√');
  };


  const onSpeechEnd = (e) => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setEnd('√');
  };


  const onSpeechError = (e) => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    setError(JSON.stringify(e.error));
  };


  const itemsList = (result) => {
    if (result) {
      result.replace("Плюс", "+").replace("плюс", "+").replace("ПЛЮС", "+").replace("PLUS", "+").replace("Plus", "+").replace("plus", "+");
      rec_result = rec_result.concat(result.split("+")).filter(Boolean);
      setResults(rec_result);
      let copy = Object.assign({}, isChecked);
      rec_result.map((item, index) => {
        copy[index] = true;
      });
      setIsChecked(copy);
      console.log(rec_result);
    }
  };


  const onSpeechResults = (e) => {
    //Invoked when SpeechRecognizer is finished recognizing
    console.log('onSpeechResults: ', e);
    setResults(e.value);
  };


  const onSpeechPartialResults = (e) => {
    //Invoked when any results are computed
    console.log('onSpeechPartialResults: ', e);
    setPartialResults(e.value);
  };


  const onSpeechVolumeChanged = (e) => {
    //Invoked when pitch that is recognized changed
    console.log('onSpeechVolumeChanged: ', e);
    setPitch(e.value);
  };


  const startRecognizing = async () => {
    rec_switch = true;
    //Starts listening for speech for a specific locale
    try {
      await Voice.start('ru-RU');
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };


  const stopRecognizing = () => {
    rec_switch = false;
    //Stops listening for speech
    try {
      Voice.stop();
      let itemResult;
      console.log(results);
      for (i = 0; i < results.length; i++) {
        if (results[i].length > 0) {
          itemResult = results[i];
          console.log(itemResult);
          break;
        }
      }
      itemsList(itemResult);
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };


  const cancelRecognizing = async () => {
    //Cancels the speech recognition
    try {
      await Voice.cancel();
    } catch (e) {
      //eslint-disable-next-line
      console.error(e); r
    }
  };


  const checkRec = () => {
    console.log(rec_switch);
    rec_switch === false ? startRecognizing() : stopRecognizing();
  };


  const delList = () => {
    setIsChecked({});
    rec_result = [];
    setResults([]);
  };


  const destroyRecognizer = async () => {
    //Destroys the current SpeechRecognizer instance
    try {
      await Voice.destroy();
      setPitch('');
      setError('');
      setStarted('');
      setResults([]);
      setPartialResults([]);
      setEnd('');
    } catch (e) {
      //eslint-disable-next-line
      console.error(e);
    }
  };


  function handleOnClick(key) {
    let copy = Object.assign({}, isChecked);
    copy[key] = copy[key] === true ? false : true;
    console.log(key, copy[key]);
    setIsChecked(copy);
  }


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.horizontalView, styles.headerView, styles.topBottomZ]}>
          <TouchableOpacity
            onPress={checkRec}
            style={[styles.headerStyle, styles.buttonTextHeader]}>
            <Text style={styles.buttonTextStyle}>
              {'id'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.titleText}>
            SimpleDo
          </Text>
          <TouchableOpacity
            onPress={checkRec}
            style={[styles.headerStyle, styles.buttonTextHeader]}>
            <Text style={styles.buttonTextStyle}>
              {'?'}
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <ScrollView style={{ paddingBottom: 100, paddingTop: 50, width: screenWidth, }}>
            {rec_result.map((result, index) => {
              return (
                <View key={"i" + index} style={styles.viewLine}>
                  <TouchableOpacity
                    style={(isChecked[index] === true) ? styles.activeItemStyle : styles.inactiveItemStyle}
                    onPress={() => { handleOnClick(index); }}
                    underlayColor='#fff'>
                    <Text style={{ fontSize: 20 }}>{result}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={[styles.horizontalView, styles.bottomView, styles.topBottomZ]}>

          <TouchableOpacity
            onPress={delList}
            style={[styles.buttonStyle, styles.buttonStyleDel]}>
            <Image source={require('./assets/del.png')} style={styles.buttonImageStyle} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={checkRec}
            style={[styles.buttonStyle, styles.buttonStyleRec, { backgroundColor: rec_switch === false ? "#8ad24e" : "red" }]}>
            <Image source={require('./assets/mic.png')} style={styles.buttonImageStyle} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={destroyRecognizer}
            style={[styles.buttonStyle, styles.buttonStyleSend]}>
            <Image source={require('./assets/share.png')} style={styles.buttonImageStyle} />
          </TouchableOpacity>

        </View>
        <View style={[styles.horizontalView, styles.buttonStyleRec, styles.bottomView]}>
        </View>

      </View>
    </SafeAreaView >
  );
};


export default App;


const styles = StyleSheet.create({
  viewLine: {
    width: screenWidth,
    padding: 0,
    backgroundColor: "#eee"
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5,
    backgroundColor: "#eee"
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    flex: 3,
  },
  headerView: {
    justifyContent: 'center',
    flex: 1,
    padding: 10,
    backgroundColor: "#e8e8e8",
    top: -5,
    width: "105%",
    height: 50
  },
  bottomView: {
    padding: 10,
    paddingBottom: 35,
    backgroundColor: "#e8e8e8",
    bottom: -35,
    width: "105%",
  },
  topBottomZ: {
    opacity: 1,
    zIndex: 2
  },
  headerStyle: {
    flex: 1,
    justifyContent: 'center',
    margin: 0,
    padding: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 3,
  },
  buttonStyle: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    margin: 5,
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
    elevation: 3,
    height: 50
  },
  buttonStyleDel: {
    backgroundColor: "#d2aa6e",
    flex: 1
  },
  buttonStyleRec: {
    backgroundColor: "#8ad24e",
    flex: 3,
    height: 60
  },
  buttonStyleSend: {
    backgroundColor: "#aa8ef2",
    flex: 1
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  buttonImageStyle: {
    resizeMode: 'center',
    width: 32,
    height: 32
  },
  buttonTextHeader: {
    backgroundColor: "#999",
    flex: 1
  },
  horizontalView: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: "100 %"
  },
  activeItemStyle: {
    padding: 20,
    margin: 6,
    borderRadius: 10,
    fontSize: 20,
    width: screenWidth * 0.7,
    backgroundColor: "#8ad24e",
    alignSelf: 'flex-end'
  },
  inactiveItemStyle: {
    padding: 20,
    margin: 6,
    borderRadius: 10,
    fontSize: 20,
    width: screenWidth * 0.7,
    backgroundColor: "#ddd",
    alignSelf: 'flex-start'
  },
  textWithSpaceStyle: {
    flex: 1,
    textAlign: 'center',
    color: '#B0171F',
  },
});