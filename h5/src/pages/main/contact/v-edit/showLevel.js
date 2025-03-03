/*
* @author 友人a丶
* @date 
* 
* */

import {ref} from "vue";

export default function (customer) {
    /*
    * 选择税务评级
    * */
    const showStar = ref(false);
    const stars = [
        {name: '1星', value: 1},
        {name: '2星', value: 2},
        {name: '3星', value: 3},
        {name: '4星', value: 4}
    ];

    /*
    * 选择税务评级
    * */
    const onSelectStar = (item) => {
        customer.edit.star = parseInt(item.value);
        showStar.value = false;
    };


    return {
        showStar,
        onSelectStar,
        stars
    }
}