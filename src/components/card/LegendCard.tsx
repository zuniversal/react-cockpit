import React, { useState } from 'react';
import styles from './LegendCard.module.less'

export const LegendCard =(props) => {
    // console.log(props)
    const element = (
        <div className={styles.container}>
            <div className={styles.CardContainer}>
                <div className={styles.CardTitle}>{props.legendCardItem[0].title}</div>
                <div>
                    <span className={styles.CardContentSales}>{props.legendCardItem[0].type}:<span style={{color:'#678EF2'}}>{props.legendCardItem[0].typeValue}</span></span>
                    <span className={styles.CardContentSales} style={{marginLeft:10}}>{props.legendCardItem[0].CompareType}:<span style={{color:'#5FCABB'}}>{props.legendCardItem[0].CompareValue}</span></span>
                </div>
            </div>
            <div style={{marginLeft:3,marginRight:3}}></div>
            <div className={styles.CardContainer}>
                <div className={styles.CardTitle}>{props.legendCardItem[1].title}</div>
                <div>
                    <span className={styles.CardContentSales}>{props.legendCardItem[1].type}:<span style={{color:'#678EF2'}}>{props.legendCardItem[1].typeValue}</span></span>
                    <span className={styles.CardContentSales} style={{marginLeft:10}}>{props.legendCardItem[1].CompareType}:<span style={{color:'#5FCABB'}}>{props.legendCardItem[1].CompareValue}</span></span>
                </div>
            </div>
        </div>
    )
    return element
}
