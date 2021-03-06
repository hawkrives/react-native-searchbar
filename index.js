import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Platform,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import PropTypes from 'prop-types';

const INITIAL_TOP = Platform.OS === 'ios' ? -80 : -60;

export default class Search extends Component {
  static propTypes = {
    input: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    handleChangeText: PropTypes.func.isRequired,
    onSubmitEditing: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onHide: PropTypes.func,
    onBack: PropTypes.func,
    onX: PropTypes.func,
    backButton: PropTypes.object.isRequired,
    backButtonAccessibilityLabel: PropTypes.string,
    closeButton: PropTypes.object.isRequired,
    closeButtonAccessibilityLabel: PropTypes.string,
    backCloseSize: PropTypes.number,
    fontSize: PropTypes.number,
    heightAdjust: PropTypes.number,
    backgroundColor: PropTypes.string,
    iconColor: PropTypes.string,
    textColor: PropTypes.string,
    selectionColor: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    animate: PropTypes.bool,
    animationDuration: PropTypes.number,
    showOnLoad: PropTypes.bool,
    hideBack: PropTypes.bool,
    hideX: PropTypes.bool,
    iOSPadding: PropTypes.bool,
    iOSPaddingBackgroundColor: PropTypes.string,
    iOSHideShadow: PropTypes.bool,
    clearOnShow: PropTypes.bool,
    clearOnHide: PropTypes.bool,
    clearOnBlur: PropTypes.bool,
    focusOnLayout: PropTypes.bool,
    autoCorrect: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    keyboardAppearance: PropTypes.string,
    fontFamily: PropTypes.string,
    editable: PropTypes.bool,
  };

  static defaultProps = {
    input: '',
    placeholder: 'Search',
    backButtonAccessibilityLabel: 'Navigate up',
    closeButtonAccessibilityLabel: 'Clear search text',
    heightAdjust: 0,
    backgroundColor: 'white',
    iconColor: 'gray',
    textColor: 'gray',
    selectionColor: 'lightskyblue',
    placeholderTextColor: 'lightgray',
    animate: true,
    animationDuration: 200,
    showOnLoad: false,
    hideBack: false,
    hideX: false,
    iOSPadding: true,
    iOSPaddingBackgroundColor: 'transparent',
    iOSHideShadow: false,
    clearOnShow: false,
    clearOnHide: true,
    clearOnBlur: false,
    focusOnLayout: true,
    autoCorrect: true,
    autoCapitalize: 'sentences',
    keyboardAppearance: 'default',
    fontFamily: 'System',
    backCloseSize: 28,
    fontSize: 20,
    editable: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      show: props.showOnLoad,
      top: new Animated.Value(
        props.showOnLoad ? 0 : INITIAL_TOP + props.heightAdjust
      ),
    };
  }

  show = () => {
    const {
      animate,
      animationDuration,
      clearOnShow,
      handleChangeText,
    } = this.props;
    if (clearOnShow) {
      handleChangeText('');
    }
    this.setState({ show: true });
    if (animate) {
      Animated.timing(this.state.top, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      this.setState({ top: new Animated.Value(0) });
    }
  };

  hide = () => {
    const { onHide, animate, animationDuration } = this.props;
    if (onHide) {
      onHide();
    }
    if (animate) {
      Animated.timing(this.state.top, {
        toValue: INITIAL_TOP,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
      const timerId = setTimeout(() => {
        this._doHide();
        clearTimeout(timerId);
      }, animationDuration);
    } else {
      this.setState({ top: new Animated.Value(INITIAL_TOP) });
      this._doHide();
    }
  };

  _doHide = () => {
    const { clearOnHide, handleChangeText } = this.props;
    this.setState({ show: false });
    if (clearOnHide) {
      handleChangeText('');
    }
  };

  _handleX = () => {
    const { onX } = this.props;
    this._clearInput();
    if (onX) onX();
  };

  _handleBlur = () => {
    const { onBlur, clearOnBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
    if (clearOnBlur) {
      this._clearInput();
    }
  };

  _clearInput = () => {
    this._onChangeText('');
  };

  _onChangeText = input => {
    this.props.handleChangeText(input);
  };

  render = () => {
    const {
      placeholder,
      heightAdjust,
      backgroundColor,
      iconColor,
      textColor,
      selectionColor,
      placeholderTextColor,
      onBack,
      hideBack,
      hideX,
      iOSPadding,
      iOSPaddingBackgroundColor,
      iOSHideShadow,
      onSubmitEditing,
      onFocus,
      focusOnLayout,
      autoCorrect,
      autoCapitalize,
      keyboardAppearance,
      fontFamily,
      backButton,
      backButtonAccessibilityLabel,
      closeButton,
      closeButtonAccessibilityLabel,
      backCloseSize,
      fontSize,
      editable,
    } = this.props;

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: this.state.top }],
            shadowOpacity: iOSHideShadow ? 0 : 0.7,
          },
        ]}
      >
        {this.state.show && (
          <View style={[styles.navWrapper, { backgroundColor }]}>
            {Platform.OS === 'ios' && iOSPadding && (
              <View
                style={{
                  height: 20,
                  backgroundColor: iOSPaddingBackgroundColor,
                }}
              />
            )}
            <View
              style={[
                styles.nav,
                { height: (Platform.OS === 'ios' ? 52 : 62) + heightAdjust },
              ]}
            >
              {!hideBack && backButton && (
                <TouchableOpacity
                  accessible={true}
                  accessibilityComponentType="button"
                  accessibilityLabel={backButtonAccessibilityLabel}
                  onPress={onBack || this.hide}
                >
                  <View style={{ width: backCloseSize, height: backCloseSize }}>
                    {backButton}
                  </View>
                </TouchableOpacity>
              )}
              <TextInput
                ref={ref => (this.textInput = ref)}
                onLayout={() => focusOnLayout && this.textInput.focus()}
                style={[
                  styles.input,
                  {
                    fontSize: fontSize,
                    color: textColor,
                    fontFamily: fontFamily,
                    marginLeft: hideBack ? 30 : 0,
                    marginTop:
                      Platform.OS === 'ios' ? heightAdjust / 2 + 10 : 0,
                  },
                ]}
                selectionColor={selectionColor}
                onChangeText={input => this._onChangeText(input)}
                onSubmitEditing={() =>
                  onSubmitEditing ? onSubmitEditing() : null
                }
                onFocus={() => (onFocus ? onFocus() : null)}
                onBlur={this._handleBlur}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                value={this.props.input}
                underlineColorAndroid="transparent"
                returnKeyType="search"
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                keyboardAppearance={keyboardAppearance}
                editable={editable}
              />
              {closeButton && (
                <TouchableOpacity
                  accessible={true}
                  accessibilityComponentType="button"
                  accessibilityLabel={closeButtonAccessibilityLabel}
                  onPress={
                    hideX || this.props.input === '' ? null : this._handleX
                  }
                >
                  <View style={{ width: backCloseSize, height: backCloseSize }}>
                    {closeButton}
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </Animated.View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    position: 'absolute',
    elevation: 2,
    shadowRadius: 5,
  },
  navWrapper: {
    width: Dimensions.get('window').width,
  },
  nav: {
    ...Platform.select({
      android: {
        borderBottomColor: 'lightgray',
        borderBottomWidth: StyleSheet.hairlineWidth,
      },
    }),
    flex: 1,
    flexBasis: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  input: {
    ...Platform.select({
      ios: { height: 30 },
      android: { height: 50 },
    }),
    width: Dimensions.get('window').width - 120,
  },
});
