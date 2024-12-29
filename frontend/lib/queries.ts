import { sanityClient } from "@/lib/sanityClient";
import axios from "axios";

export const restaurantQuery = `
  *[_type == "restaurant"]{
    title,
    Weekdaytime {
      start,
      end
    },
    Weekandtime {
      start,
      end
    },
    blacklist
  }
`;

export const tableQuery = `
  *[_type == "table"]{
    type,
    quantity,
    _id
  }
`;

export const restaurantLocationQuery = `
  *[_type == "restaurant"][0] {
    locationTitle,
    address,
    iframeSrc
  }
`;


export const homePageQuery = `
  *[_type == "HomePage"]{
    Homepagetitle,
    backgroundimg{
      asset->{
        url
      }
    },
    dishimg{
      asset->{
        url
      }
    },
    cheftext,
    chefname,
    galleryPhotos[] {
      asset -> {
        url
      }
    },
    menuName,
    menuLink,
    menuDescription[] {
      children[] {
        text
      }
    },
    OpeninghourPhotos[] {
      asset -> {
        url
      }
    },
    testimonials[] {
      name,
      review,
      region,
      image {
        asset -> {
          url
        }
      }
    },
    "footer": {
      address,
      phone,
      email,
      copyright,
      mapEmbedUrl,
      insEmbedId,
      topImage {
        asset -> {
          url
        }
      }
    }
  }
`;

export async function fetchRestaurant() {
  const restaurantData = await sanityClient.fetch(restaurantQuery);
  return restaurantData;
}

export async function fetchRestaurantLocation() {
  const locationDetails = await sanityClient.fetch(restaurantLocationQuery);
  return locationDetails;
}

export async function fetchTables() {
  const tableData = await sanityClient.fetch(tableQuery);
  return tableData;
}

export async function fetchHomePageData() {
    const data = await sanityClient.fetch(homePageQuery);
    return data;
}
  

export async function fetchOpeningHours(apiKey: string, placeId: string) {
    const mapsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;
    const response = await axios.get(mapsUrl);
    return response.data.result?.opening_hours?.weekday_text || [""];
  }
