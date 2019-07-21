/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Keyboard,
    TouchableWithoutFeedback,
    Text,
    KeyboardAvoidingView,
    StatusBar,
} from 'react-native';

import CNRichTextEditor, {
    CNToolbar,
    getInitialObject,
    convertToHtmlString,
    convertToObject,
    getDefaultStyles,
} from './FCEditor/index.js';

const HTMLString =
    '<div><h1><span style="font-weight: bold;">Yr</span></h1><p><span>Cc</span></p><p><span></span><span style="font-weight: bold;">Bb</span></p><p><span style="font-weight: bold;">XX</span></p><p><span style="font-weight: bold;"></span><span style="font-style: italic;">Is</span></p></div>';
const HTMLString2 = `<p>sadsadasd</p><p><em>Italic</em></p>

<p><strong>Bold  here - </strong><u>underline</u></p>

<h1>Heading 1</h1>

<p>Paragraph</p>

<h2>Heading two</h2>

<ul>
\t<li>Normal list</li>
\t<li>asd</li>
</ul>

<p>Test</p>

<ol>
\t<li>Nuumbered list</li>
</ol>`;

const defaultStyles = getDefaultStyles();
const initialValue = [
    {
        component: 'text',
        id: 'kmxV_Gj2kW',
        content: [
            {
                id: 'trypjifqCw',
                text: 'Title h1',
                len: 8,
                stype: ['bold'],
                styleList: {fontWeight: 'bold', fontSize: 42},
                tag: 'title',
                NewLine: true,
            },
            {
                id: 'NYQgzFesbt',
                text: '\nCc',
                len: 3,
                stype: [],
                styleList: {},
                tag: 'body',
                NewLine: true,
            },
            {
                id: 'x9D2eheIcC',
                text: '\n',
                len: 1,
                stype: [],
                styleList: {},
                tag: 'body',
                NewLine: true,
            },
            {
                id: 'cekeOtLX7V',
                text: 'Bb',
                len: 2,
                stype: ['bold'],
                styleList: {fontWeight: 'bold'},
                tag: 'body',
                NewLine: false,
            },
            {
                id: '3Gc5WbLvnh',
                text: '\nXX',
                len: 3,
                stype: ['bold'],
                styleList: {fontWeight: 'bold'},
                tag: 'body',
                NewLine: true,
            },
            {
                id: 'krS6KjP9JE',
                text: '\n',
                len: 1,
                stype: ['bold'],
                styleList: {fontWeight: 'bold'},
                tag: 'body',
                NewLine: true,
            },
            {
                id: 'wZ_OOgTBnV',
                text: 'Is',
                len: 2,
                stype: ['italic'],
                styleList: {fontStyle: 'italic'},
                tag: 'body',
                NewLine: false,
            },
        ],
    },
];
class App extends React.Component {
    constructor(props) {
        super(props);
        // const initialObject = convertToObject(HTMLString);
        // console.warn("-- Console in", initialObject);
        this.state = {
            selectedTag: 'body',
            selectedStyles: [],
            value: initialValue,
        };

        this.editor = null;
    }

    componentDidMount(): * {
        const initialObject = convertToObject(HTMLString, null, false);
        // this.setState({value: initialObject});
        this.setState({
            value: initialValue,
        });
    }

    onStyleKeyPress = toolType => {
        this.editor.applyToolbar(toolType);
    };

    onSelectedTagChanged = tag => {
        this.setState({
            selectedTag: tag,
        });
    };

    onSelectedStyleChanged = styles => {
        this.setState({
            selectedStyles: styles,
        });
    };

    onValueChanged = value => {
        console.warn(
            '-- Console VALUE',
            JSON.stringify(value),
            convertToHtmlString(value)
        );
        this.setState({
            value: value,
        });
    };

    render() {
        return (
            <KeyboardAvoidingView
                behavior="padding"
                enabled
                keyboardVerticalOffset={0}
                style={{
                    flex: 1,
                    paddingTop: 20,
                    backgroundColor: '#eee',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.main}>
                        <CNRichTextEditor
                            ref={input => (this.editor = input)}
                            onSelectedTagChanged={this.onSelectedTagChanged}
                            onSelectedStyleChanged={this.onSelectedStyleChanged}
                            value={this.state.value}
                            style={{backgroundColor: '#fff'}}
                            styleList={defaultStyles}
                            onValueChanged={this.onValueChanged}
                        />
                    </View>
                </TouchableWithoutFeedback>

                <View
                    style={{
                        minHeight: 35,
                    }}>
                    <CNToolbar
                        size={28}
                        bold={
                            <Text
                                style={[
                                    styles.toolbarButton,
                                    styles.boldButton,
                                ]}>
                                B
                            </Text>
                        }
                        italic={
                            <Text
                                style={[
                                    styles.toolbarButton,
                                    styles.italicButton,
                                ]}>
                                I
                            </Text>
                        }
                        underline={
                            <Text
                                style={[
                                    styles.toolbarButton,
                                    styles.underlineButton,
                                ]}>
                                U
                            </Text>
                        }
                        lineThrough={
                            <Text
                                style={[
                                    styles.toolbarButton,
                                    styles.lineThroughButton,
                                ]}>
                                S
                            </Text>
                        }
                        body={<Text style={styles.toolbarButton}>T</Text>}
                        title={<Text style={styles.toolbarButton}>h1</Text>}
                        heading={<Text style={styles.toolbarButton}>h3</Text>}
                        ul={<Text style={styles.toolbarButton}>ul</Text>}
                        ol={<Text style={styles.toolbarButton}>ol</Text>}
                        selectedTag={this.state.selectedTag}
                        selectedStyles={this.state.selectedStyles}
                        onStyleKeyPress={this.onStyleKeyPress}
                    />
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f0f0f0',
        height: '100%',
    },
    engine: {
        flex: 1,
    },
    main: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 1,
        alignItems: 'stretch',
    },
    toolbarButton: {
        fontSize: 20,
        width: 28,
        height: 28,
        textAlign: 'center',
    },
    italicButton: {
        fontStyle: 'italic',
    },
    boldButton: {
        fontWeight: 'bold',
    },
    underlineButton: {
        textDecorationLine: 'underline',
    },
    lineThroughButton: {
        textDecorationLine: 'line-through',
    },
});

export default App;
