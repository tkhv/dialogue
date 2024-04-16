"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ClubMenu from "@/components/clubMenu";
import { Club, defaultClubs } from "@/lib/types";
import { collection, getDocs } from "firebase/firestore";
import { db, resetDB } from "@/lib/firebase";

export default function Clubs() {
  const [position, setPosition] = useState("bottom");
  const [clubsList, setClubsList] = useState<Club[]>([]);
  const router = useRouter();

  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
    city: string;
    state: string;
  }>({ latitude: null, longitude: null, city: "", state: "" });

  useEffect(() => {
    // const geocode = async (lat: number, long: number) => {
    //   const resp = await fetch(
    //     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${process.env.NEXT_PUBLIC_GMAPS_API_KEY}`
    //   );
    //   return await resp.json();
    // };

    // const getPosition = async () => {
    //   if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(async (position) => {
    //       const response = await geocode(
    //         position.coords.latitude,
    //         position.coords.longitude
    //       );
    //       console.log(response);

    //       setLocation({
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //         city: response.results[0].address_components[2].long_name,
    //         state: response.results[0].address_components[4].short_name,
    //       });
    //     });
    //   } else {
    console.log(
      "Geolocation is not supported by this browser, hardcoding Atlanta, GA."
    );
    setLocation({
      latitude: 33.7488,
      longitude: 84.3877,
      city: "Atlanta",
      state: "GA",
    });
    // }
    // };

    // getPosition();
  }, []);

  useEffect(() => {
    const loadDocuments = async () => {
      const querySnapshot = await getDocs(collection(db, "clubs"));
      const docs = new Set();
      querySnapshot.forEach((doc) => {
        docs.add(doc.data());
      });
      let docArray = Array.from(docs);
      setClubsList(docArray as Club[]);
    };

    loadDocuments();
  }, []);

  if (location.latitude && location.longitude) {
    console.log(clubsList);
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          color: "white",
        }}
      >
        <h1 className="text-4xl font-bold pt-10 pb-5">
          {" "}
          Clubs Near {location.city}, {location.state}
        </h1>
        <Separator />
        <div className="flex flex-row pt-5 pb-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                style={{
                  color: "white",
                  backgroundColor: "#15181D",
                  marginRight: "10px",
                }}
              >
                Distance
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="15">15 mi.</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="25">25 mi.</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">50 mi.</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                style={{
                  color: "white",
                  backgroundColor: "#15181D",
                  marginLeft: "10px",
                }}
              >
                Sort By
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuRadioGroup
                value={position}
                onValueChange={setPosition}
              >
                <DropdownMenuRadioItem value="size-asc">
                  Size Asc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="size-desc">
                  Size Desc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sim-asc">
                  Similarity Asc
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sim-desc">
                  Similarity Desc.
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="newest">
                  Newest
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            style={{
              color: "white",
              backgroundColor: "#15181D",
              marginLeft: "auto",
            }}
            onClick={() => {
              resetDB();
            }}
          >
            Reset DB
          </Button>
          <Button
            variant="outline"
            style={{
              color: "white",
              backgroundColor: "#15181D",
              marginLeft: "auto",
            }}
            onClick={() => router.push("/clubs/create")}
          >
            Create
          </Button>
        </div>
        <Separator />
        <div
          style={{
            overflow: "hidden",
            maxHeight: "100%",
            height: "100%",
          }}
        >
          {clubsList.length > 0 ? (
            <ClubMenu clubs={clubsList} />
          ) : (
            <ClubMenu clubs={defaultClubs} />
          )}
        </div>
      </div>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("animate-spin", "text-white", "m-20")}
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    );
  }
}
