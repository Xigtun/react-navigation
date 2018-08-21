import React from 'react';
import {
    I18nManager,
    Image,
    Text,
    View,
    Platform,
    StyleSheet, TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

import TouchableItem from '../TouchableItem';

const defaultBackImage = require('../assets/back-icon.png');

class HeaderBackButton extends React.PureComponent {
  static defaultProps = {
    pressColorAndroid: 'rgba(0, 0, 0, .32)',
    tintColor: Platform.select({
      ios: '#037aff',
    }),
    truncatedTitle: 'Back',
  };

  state = {};

  _onTextLayout = e => {
    if (this.state.initialTextWidth) {
      return;
    }
    this.setState({
      initialTextWidth: e.nativeEvent.layout.x + e.nativeEvent.layout.width,
    });
  };

  _renderBackImage() {
      return <NavigationIconButton
          disabled
          icon={require('./back-icon.png')}
          tintColor={'white'}
      />
  }

  render() {
    const {
      onPress,
      pressColorAndroid,
      width,
      title,
      titleStyle,
      tintColor,
      truncatedTitle,
    } = this.props;

    const renderTruncated =
      this.state.initialTextWidth && width
        ? this.state.initialTextWidth > width
        : false;

    const backButtonTitle = renderTruncated ? truncatedTitle : title;

    return (
      <TouchableItem
        accessibilityComponentType="button"
        accessibilityLabel={backButtonTitle}
        accessibilityTraits="button"
        testID="header-back"
        delayPressIn={0}
        onPress={onPress}
        pressColor={pressColorAndroid}
        style={styles.container}
        borderless
      >
        <View style={styles.container}>
          {this._renderBackImage()}
          {Platform.OS === 'ios' &&
            typeof backButtonTitle === 'string' && (
              <Text
                onLayout={this._onTextLayout}
                style={[
                  styles.title,
                  !!tintColor && { color: tintColor },
                  titleStyle,
                ]}
                numberOfLines={1}
              >
                {backButtonTitle}
              </Text>
            )}
        </View>
      </TouchableItem>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 17,
    paddingRight: 10,
  },
  icon:
    Platform.OS === 'ios'
      ? {
          height: 21,
          width: 13,
          marginLeft: 9,
          marginRight: 22,
          marginVertical: 12,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        }
      : {
          height: 24,
          width: 24,
          margin: 16,
          resizeMode: 'contain',
          transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
        },
  iconWithTitle:
    Platform.OS === 'ios'
      ? {
          marginRight: 6,
        }
      : {},
});

export default HeaderBackButton;



export class NavigationButton extends TouchableOpacity {

    static propTypes = {
        ...TouchableOpacity.propTypes,
    };

    static defaultProps = {
        ...TouchableOpacity.defaultProps,
        hitSlop: {top: 12, bottom: 12, left: 8, right: 8},
    };

    static contextTypes = {
        tintColor: PropTypes.string,
    };

    buildProps() {
        let {style, ...others} = this.props;

        style = [{
            backgroundColor: 'rgba(0, 0, 0, 0)',
            paddingLeft: 6,
            paddingRight: 6,
            overflow: 'hidden',
            flexDirection: 'row',
            alignItems: 'center',
        }].concat(style);

        this.props = {style, ...others};
    }

    render() {
        this.buildProps();
        return super.render();
    }

}



export class NavigationIconButton extends NavigationButton {

    static propTypes = {
        ...NavigationButton.propTypes,
        icon: Image.propTypes.source,
        tintColor: PropTypes.string
    }

    buildProps() {
        super.buildProps();

        let {icon, children, ...others} = this.props;
        if (icon) {
            let iconStyle = {
                tintColor: this.props.tintColor ? this.props.tintColor:this.context.tintColor,
                width: 20,
                height: 20,
                resizeMode: 'contain'
            };
            children = <Image style={iconStyle} source={icon} />;
        }

        this.props = {icon, children, ...others};
    }

}