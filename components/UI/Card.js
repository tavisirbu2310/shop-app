import React from 'react';
import {View,StyleSheet} from 'react-native';

const Card = props => {
    return(
        <View style={{...styles.card,...props.style}}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        shadowColor: 'black',
        shadowOpacity: .4,
        shadowOffset: {width: 5, height: 10},
        shadowRadius: 10,
        elevation: 7,
        borderRadius: 10,
        backgroundColor: 'white'
    }
});

export default Card;