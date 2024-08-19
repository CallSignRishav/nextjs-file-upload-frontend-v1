import { sdk } from "@/utils/sdk";
import { uploadFiles } from "@directus/sdk";
import { Button, Card, CardBody, CardFooter } from "@nextui-org/react";
import { useFilePicker } from "use-file-picker";

const Demo = () => {
  const { openFilePicker, filesContent, loading, errors, plainFiles, clear } =
    useFilePicker({
      multiple: false,
      accept: "image/*",
      readAs: "DataURL",
      onFilesSuccessfullySelected: async ({ filesContent, plainFiles }) => {
        console.log(plainFiles);

        // const formData = new FormData();

        // formData.append("file", plainFiles[0]);

        // const { id, title } = await sdk.request(uploadFiles(formData));
      },
    });

  const upFile = async () => {
    const formData = new FormData();

    formData.append("file", plainFiles[0]);

    const fs = await sdk.request(uploadFiles(formData));

    console.log(fs);

    clear();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className=''>
        <CardBody>
          {filesContent.map((file, index) => {
            return (
              <Card key={index}>
                <CardBody>
                  <img
                    alt={file.name}
                    src={file.content}
                    width={300}
                    className='rounded-xl'
                  />
                </CardBody>
              </Card>
            );
          })}
        </CardBody>

        <CardFooter className='space-x-4'>
          <Button
            size='lg'
            variant='ghost'
            color='primary'
            onPress={() => openFilePicker()}
            fullWidth>
            Select files
          </Button>

          <Button
            size='lg'
            variant='ghost'
            color='secondary'
            onPress={upFile}
            fullWidth>
            Upload
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Demo;
