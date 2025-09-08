from PIL import Image
import piexif

def clean_image(input_file, output_file):
    """Removes EXIF metadata from an image."""
    image = Image.open(input_file)
    data = list(image.getdata())
    clean_image = Image.new(image.mode, image.size)
    clean_image.putdata(data)
    clean_image.save(output_file)
    return output_file
