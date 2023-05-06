import { stripe } from "@/lib/stripe";
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from "@/styles/pages/product";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import Stripe from "stripe";
interface Props {
  product: {
    id: string;
    name: string;
    image_url: string;
    price: string;
    description: string;
    defaultPrice: string;
  };
}
export default function Product({ product }: Props) {
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  async function handleBuy() {
    try {
      const response = await axios.post("/api/checkout", {
        priceID: product.defaultPrice,
      });
      const { checkoutUrl } = response.data;
      window.location.href = checkoutUrl;
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Head>
        <title>{product.name} | Ignite Shop</title>
      </Head>
      <ProductContainer>
        <ImageContainer>
          <Image src={product.image_url} width={520} height={480} alt="" />
        </ImageContainer>

        <ProductDetails>
          <h1>{product.name}</h1>
          <span>{product.price}</span>

          <p>{product.description}</p>

          <button onClick={handleBuy}>Comprar agora</button>
        </ProductDetails>
      </ProductContainer>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { id: "prod_NokCA2OIBMWhAn" } }],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  const productID = params!.id;

  const product = await stripe.products.retrieve(productID, {
    expand: ["default_price"],
  });
  const price = product.default_price as Stripe.Price;
  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        image_url: product.images[0],
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(price.unit_amount! / 100),
        description: product.description,
        defaultPrice: price.id,
      },
    },
    revalidate: 60 * 60 * 1,
  };
};
