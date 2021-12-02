import React from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList
} from "react-native";

import { icons, images, SIZES, COLORS, FONTS } from '../constants'

const Home = ({ navigation }) => {

    // Dummy Datas

    const initialCurrentLocation = {
        streetName: "TC Fashion",
        gps: {
            latitude: 1.5496614931250685,
            longitude: 110.36381866919922
        }
    }

    const categoryData = [
        {
            id: 1,
            name: "Thời Trang Nam",
            icon: icons.rice_bowl,
        },
        {
            id: 2,
            name: "Thời Trang Nữ",
            icon: icons.noodle,
        },
        {
            id: 3,
            name: "Thời Trang Trẻ Em",
            icon: icons.hotdog,
        },
        {
            id: 4,
            name: "Áo casual port",
            icon: icons.salad,
        },
        {
            id: 5,
            name: "Đồng Phục",
            icon: icons.hamburger,
        },

    ]

    // price rating
    const affordable = 1
    const fairPrice = 2
    const expensive = 3

    const restaurantData = [
        {
            id: 1,
            name: "Thời trang nam",
            rating: 4.8,
            categories: [1,2,3,4,5, 7],
            priceRating: affordable,
            photo: images.burger_restaurant_1,
            duration: "sales 30%",
            location: {
                latitude: 1.5347282806345879,
                longitude: 110.35632207358996,
            },
            courier: {
                avatar: images.avatar_1,
                name: "Thời trang nam"
            },
            menu: [
                {
                    menuId: 1,
                    name: "Polo shirt",
                    photo: images.crispy_chicken_burger,
                    description: "Chất liệu vải cotton pha",
                    calories: 200,
                    price: 100
                },
                {
                    menuId: 2,
                    name: "ÁO KHOÁC NỮ TCM CHỐNG NẮNG TRƠN CÓ NÓN TK003",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Chất hiệu thấm hút, thoải mái, thoáng mát.  Bảo vệ cơ thể các tác nhận tia cực tím, an toàn cho da. Với túi trong và túi ngoài có dây kéo, tiện lợi khi sử dụng",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 3,
                    name: "Áo thun nữ TCM cổ sơ mi croptop sọc caro TM001_21",
                    photo: images.baked_fries,
                    description: "  Chất liệu thấm hút, thoáng mát  Kiểu dáng trẻ trung, hiện đại  Đường may chắc chắn, tỉ mỉ ",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 4,
                    name: "Autumn Outdoor Boy Shirt",
                    photo: images.baked_fries,
                    description: "Autumn Outdoor Boy Shirt",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 5,
                    name: "Fashion Sport Jacket",
                    photo: images.baked_fries,
                    description: "Fashion Sport Jacket",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 5,
                    name: "Polo shirt",
                    photo: images.crispy_chicken_burger,
                    description: "Chất liệu vải cotton pha",
                    calories: 200,
                    price: 100
                },
                {
                    menuId: 5,
                    name: "ÁO KHOÁC NỮ TCM CHỐNG NẮNG TRƠN CÓ NÓN TK003",
                    photo: images.honey_mustard_chicken_burger,
                    description: "Chất hiệu thấm hút, thoải mái, thoáng mát.  Bảo vệ cơ thể các tác nhận tia cực tím, an toàn cho da. Với túi trong và túi ngoài có dây kéo, tiện lợi khi sử dụng",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 2,
                    name: "Áo thun nữ TCM cổ sơ mi croptop sọc caro TM001_21",
                    photo: images.baked_fries,
                    description: "  Chất liệu thấm hút, thoáng mát  Kiểu dáng trẻ trung, hiện đại  Đường may chắc chắn, tỉ mỉ ",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 2,
                    name: "Autumn Outdoor Boy Shirt",
                    photo: images.baked_fries,
                    description: "Autumn Outdoor Boy Shirt",
                    calories: 194,
                    price: 8
                },
                {
                    menuId: 10,
                    name: "Fashion Sport Jacket",
                    photo: images.baked_fries,
                    description: "Fashion Sport Jacket",
                    calories: 194,
                    price: 8
                }
            ]
        },
        {
            id: 2,
            name: "Thời trang nữ",
            rating: 4.8,
            categories: [ 1, 2, 4, 6 ,8 ,9],
            priceRating: expensive,
            photo: images.pizza_restaurant,
            duration: "sales 50%",
            location: {
                latitude: 1.556306570595712,
                longitude: 110.35504616746915,
            },
            courier: {
                avatar: images.avatar_2,
                name: "ÁO KHOÁC NỮ TCM CHỐNG NẮNG TRƠN CÓ NÓN TK003"
            },
            menu: [
                {
                    menuId: 4,
                    name: "ÁO KHOÁC NỮ TCM CHỐNG NẮNG TRƠN CÓ NÓN TK003",
                    photo: images.hawaiian_pizza,
                    description: "Chất hiệu thấm hút, thoải mái, thoáng mát.",
                    calories: 250,
                    price: 15
                },
                {
                    menuId: 5,
                    name: "Áo thun nữ TCM cổ sơ mi croptop sọc caro TM001_21",
                    photo: images.pizza,
                    description: "Áo thun nữ TCM cổ sơ mi croptop sọc caro TM001_21",
                    calories: 250,
                    price: 20
                },
                {
                    menuId: 6,
                    name: "Áo Khoác Gió Nữ Thể Thao Phối Lưng",
                    photo: images.tomato_pasta,
                    description: "Áo khoác nữ được tạo nên từ chất liệu 95% polyester và 5% cotton",
                    calories: 100,
                    price: 10
                },
                {
                    menuId: 7,
                    name: "Áo Phao Nữ Có Mũ Siêu Nhẹ",
                    photo: images.salad,
                    description: "Màu sắc sản phẩm trẻ trung, thiết kế form dáng dễ mặc",
                    calories: 100,
                    price: 10
                }
            ]
        },
        {
            id: 3,
            name: "Áo Polo Trẻ Em Ngắn Tay Phối Bo",
            rating: 4.8,
            categories: [3, 5 ,6],
            priceRating: expensive,
            photo: images.hot_dog_restaurant,
            duration: "sales 10%",
            location: {
                latitude: 1.5238753474714375,
                longitude: 110.34261833833622,
            },
            courier: {
                avatar: images.avatar_3,
                name: "Trẻ Em"
            },
            menu: [
                {
                    menuId: 8,
                    name: "Áo Polo Trẻ Em Ngắn Tay Phối Bo",
                    photo: images.chicago_hot_dog,
                    description: "Nằm trong nhóm những chiếc Polo có chất liệu vượt trội",
                    calories: 100,
                    price: 20
                }
            ]
        },
        {
            id: 4,
            name: "Dòng áo casual port",
            rating: 4.8,
            categories: [8],
            priceRating: expensive,
            photo: images.japanese_restaurant,
            duration: "sales 30%",
            location: {
                latitude: 1.5578068150528928,
                longitude: 110.35482523764315,
            },
            courier: {
                avatar: images.avatar_4,
                name: "Dòng áo casual port"
            },
            menu: [
                {
                    menuId: 9,
                    name: "Áo polo nữ tay ngắn phối bo",
                    photo: images.sushi,
                    description: "Tính năng nổi bật từ chất liệu vải Pique",
                    //calories: 100,
                    price: 50
                }
            ]
        },
        {
            id: 5,
            name: "Đồng phục công ty",
            rating: 4.8,
            categories: [1, 2],
            priceRating: affordable,
            photo: images.noodle_shop,
            duration: "sales 30%",
            location: {
                latitude: 1.558050496260768,
                longitude: 110.34743759630511,
            },
            courier: {
                avatar: images.avatar_4,
                name: "Đồng phục công ty"
            },
            menu: [
                {
                    menuId: 10,
                    name: "Đồng phục công ty",
                    photo: images.kolo_mee,
                    description: "Đồng phục công ty",
                    calories: 200,
                    price: 5
                },
                {
                    menuId: 11,
                    name: "Đồng phục doanh nghiệp",
                    photo: images.sarawak_laksa,
                    description: "Đồng phục doanh nghiệp",
                    calories: 300,
                    price: 8
                },
                {
                    menuId: 12,
                    name: "Đồng phục gia đình",
                    photo: images.nasi_lemak,
                    description: "Đồng phục gia đình",
                    calories: 300,
                    price: 8
                },
                {
                    menuId: 13,
                    name: "Đồng phục trường học",
                    photo: images.nasi_briyani_mutton,
                    description: "Đồng phục trường học",
                    calories: 300,
                    price: 8
                },

            ]
        },
        


    ]

    const [categories, setCategories] = React.useState(categoryData)
    const [selectedCategory, setSelectedCategory] = React.useState(null)
    const [restaurants, setRestaurants] = React.useState(restaurantData)
    const [currentLocation, setCurrentLocation] = React.useState(initialCurrentLocation)


    function onSelectCategory(category) {
        //filter restaurant
        let restaurantList = restaurantData.filter(a => a.categories.includes(category.id))

        setRestaurants(restaurantList)

        setSelectedCategory(category)
    }

    function getCategoryNameById(id) {
        let category = categories.filter(a => a.id == id)

        if (category.length > 0)
            return category[0].name

        return ""
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', height: 50 }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.nearby}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{
                            width: '70%',
                            height: "100%",
                            backgroundColor: COLORS.lightGray3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{currentLocation.streetName}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.basket}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory?.id == item.id) ? COLORS.primary : COLORS.white,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.lightGray
                        }}
                    >
                        <Image
                            source={item.icon}
                            resizeMode="contain"
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h1 }}>Trang chủ</Text>
                <Text style={{ ...FONTS.h3, color: COLORS.darkgray}}>Danh mục</Text>

                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                />
            </View>
        )
    }

    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2 }}
                onPress={() => navigation.navigate("Restaurant", {
                    item,
                    currentLocation
                })}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={item.photo}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 50,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
                    </View>
                </View>

                {/* Restaurant Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>

                <View
                    style={{
                        marginTop: SIZES.padding,
                        flexDirection: 'row'
                    }}
                >
                    {/* Rating */}
                    <Image
                        source={icons.star}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>

                    {/* Categories */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 10
                        }}
                    >
                        {
                            item.categories.map((categoryId) => {
                                return (
                                    <View
                                        style={{ flexDirection: 'row' }}
                                        key={categoryId}
                                    >
                                        <Text style={{ ...FONTS.body3 }}>{getCategoryNameById(categoryId)}</Text>
                                        <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                                    </View>
                                )
                            })
                        }

                        {/* Price */}
                        {
                            [1, 2, 3].map((priceRating) => (
                                <Text
                                    key={priceRating}
                                    style={{
                                        ...FONTS.body3,
                                        color: (priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray
                                    }}
                                >$</Text>
                            ))
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={restaurants}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30
                }}
            />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderMainCategories()}
            {renderRestaurantList()}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})

export default Home;