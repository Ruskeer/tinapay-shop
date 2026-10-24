import mongoose from "mongoose"
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/app/lib/authOptions";
import { Order } from "@/app/models/Order";
import { MenuItem } from "@/app/models/MenuItems";

const stripe = require('stripe')(process.env.STRIPE_SK);
        export async function POST(req) {
    // connect to MongoDB
    mongoose.connect(process.env.MONGO_URL);

    // get the cart items and address sent from the cart page
    const {cartProducts, address} = await req.json();

    // get the logged-in user's email
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    // save the order in the database as unpaid
    const orderDoc = await Order.create({
        userEmail,
        ...address,
        cartProducts,
        paid: false,
    });

    // list of items that will be sent to Stripe
    const stripeLineItems = [];

    // go through each product in the cart
    for (const cartProduct of cartProducts) {

        // get the real product from the database (so the price can't be faked)
        const productInfo = await MenuItem.findById(cartProduct._id);

        // start with the base price
        let productPrice = productInfo.basePrice;

        // if a size was chosen, add the size price
        if (cartProduct.size) {
            const size = productInfo.sizes
                .find(size => size._id.toString() === cartProduct.size._id.toString());
            productPrice += size.price;
        }

        // if extras were chosen, add each extra's price
        if (cartProduct.extras?.length > 0) {
            for (const cartProductExtraThing of cartProduct.extras) {
                const productExtras = productInfo.extraIngredients;
                const extraThingInfo = productExtras
                   .find(extra => extra._id.toString() === cartProductExtraThing._id
                   .toString());
                productPrice += extraThingInfo.price;
            }
        }

        const productName = cartProduct.name;
        stripeLineItems.push({
            quantity: 1,
            price_data: {
                currency: 'PHP',
                product_data: {
                    name: productName,

                },
                unit_amount: productPrice * 100,
            }
        });
    }


    const stripeSesson = await stripe.checkout.sessions.create({
        line_items: stripeLineItems,
        mode: 'payment',
        customer_email: userEmail,
        success_url: process.env.NEXTAUTH_URL + '/orders/' + orderDoc._id.toString() + '?clear-cart=1',
        cancel_url: process.env.NEXTAUTH_URL + '/cart?canceled=1',
        metadata: {orderId: orderDoc._id.toString()},
        payment_intent_data: {
            metadata:{orderId:orderDoc._id.toString()},
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Delivery fee',
                    type: 'fixed_amount',
                    fixed_amount: {amount: 500, currency: 'PHP'},
                },
            }
        ],
    });
    return Response.json(stripeSesson.url);
}