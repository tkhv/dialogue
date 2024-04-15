"use client";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { imageStorage, db } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Club } from "@/lib/types";
import { useRouter } from "next/navigation";
import Autocomplete from "react-google-autocomplete";
import { useState } from "react";

export default function CreatePage() {
  const router = useRouter();
  const [location, setLocation] = useState({
    address_components: [],
  } as any) as React.SetStateAction<any>;

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const club: Club = {
      clubID: uuidv4(),
      name: data.get("name") as string,
      description: data.get("desc") as string,
      location:
        location.address_components[0].long_name +
        ", " +
        location.address_components[2].short_name,
      latitude: location.geometry.location.lat(),
      longitude: location.geometry.location.lng(),
      thumbnail: "",
      memberNames: [],
      genres: [],
      events: [],
    };

    const imgRef = ref(imageStorage, `thumbnails/${club.clubID}`);
    await uploadBytes(imgRef, data.get("thumbnail") as Blob);
    club.thumbnail = await getDownloadURL(imgRef);
    console.log(club);

    const docRef = doc(db, "clubs", club.clubID);
    await setDoc(docRef, {
      clubID: club.clubID,
      name: club.name,
      description: club.description,
      location: club.location,
      latitude: club.latitude,
      longitude: club.longitude,
      thumbnail: club.thumbnail,
      memberNames: club.memberNames,
      genres: club.genres,
      events: club.events,
    });
    const docSnap = await getDoc(docRef);
    console.log(docSnap.data());

    // router.push(`/clubs`);
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      <h1 className="text-4xl font-bold pt-10 pb-5"> Create a club</h1>
      <Separator />
      <div className="flex flex-row pt-10 pb-5" style={{ width: "100%" }}>
        <Card
          style={{
            color: "white",
            backgroundColor: "#16181D",
            border: "0px",
            width: "100%",
          }}
        >
          <CardContent>
            <form onSubmit={submit}>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="string"
                      placeholder="Amateur Screenwriters Club"
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Location</Label>
                    <Autocomplete
                      apiKey={process.env.NEXT_PUBLIC_GMAPS_API_KEY}
                      onPlaceSelected={(place) => {
                        console.log(place);
                        setLocation(place);
                      }}
                      id="location"
                      name="location"
                      style={{ color: "black" }}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    placeholder="A club for aspiring screenwriters to discuss movies and share scripts."
                    style={{ color: "black" }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="thumbnail">Group Thumbnail</Label>
                  <Input
                    name="thumbnail"
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    style={{ color: "black" }}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: "black", marginTop: "10px" }}
                >
                  Create club
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
