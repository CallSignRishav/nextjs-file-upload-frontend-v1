import { sdk } from "@/utils/sdk";
import { CreatePostInput, createPostSchema } from "@/utils/zod";
import { createItem, uploadFiles } from "@directus/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, Divider, Textarea } from "@nextui-org/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFilePicker } from "use-file-picker";

const TestOne = () => {
  // for storing file state manually
  const [fileSelected, setFileSelected] = useState(false);

  // using useFilePicker for file selection
  const { openFilePicker, filesContent, plainFiles, clear } = useFilePicker({
    multiple: false,
    accept: "image/*",
    readAs: "DataURL",
    onFilesSuccessfullySelected: () => {
      setFileSelected(true);
    },
    onClear: () => {
      setFileSelected(false);
    },
  });

  // using react-hook-form for form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
  });

  // funtion to clear form and reset file state
  const clearFn = () => {
    clear();
    reset();
  };

  // function to create post with file and caption
  const createPostFn = async (fData: CreatePostInput) => {
    // uploading file and getting file id
    const formData = new FormData();

    formData.append("file", plainFiles[0]);

    const { id } = await sdk.request(uploadFiles(formData));

    // creating post object with file id from uploaded image and caption from react-hook-form
    const postToCreate = {
      img: id,
      caption: fData.caption,
    };

    // creating post in directus
    const createdPost = await sdk.request(
      createItem("blogPosts", postToCreate)
    );

    console.log(createdPost);

    clearFn();
  };

  return (
    <>
      <div className="">
        <Card>
          <CardBody className="min-w-[300px] items-center gap-4">
            <div className="text-3xl font-semibold">Create Post</div>
            <Divider />

            {fileSelected ? (
              <></>
            ) : (
              <Button
                size="lg"
                color="primary"
                variant="ghost"
                onPress={() => openFilePicker()}
                fullWidth
              >
                Select image
              </Button>
            )}

            {filesContent.map((file, index) => {
              return (
                <div key={index}>
                  <img
                    alt={file.name}
                    src={file.content}
                    width={300}
                    className="rounded-xl"
                  />
                </div>
              );
            })}

            {fileSelected ? (
              <>
                <form
                  onSubmit={handleSubmit(createPostFn)}
                  className="w-full space-y-4"
                  noValidate
                >
                  <Textarea
                    color="primary"
                    variant="bordered"
                    label="Caption"
                    {...register("caption")}
                    errorMessage={errors.caption?.message}
                    isInvalid={!!errors.caption?.message}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    color="primary"
                    variant="shadow"
                    fullWidth
                  >
                    Create Post
                  </Button>
                  <Button
                    onPress={clearFn}
                    size="lg"
                    color="danger"
                    variant="shadow"
                    fullWidth
                  >
                    Cancel
                  </Button>
                </form>
              </>
            ) : (
              <></>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default TestOne;
