from PIL import Image
import sys

img = Image.open(r"C:\Users\mof36\.gemini\antigravity\brain\ac279964-660c-436c-8d5e-7124d583a07a\.user_uploaded\media_1789711973835.jpg")
img = img.convert("RGB")
pixels = img.load()

# Check a pixel where "y" in "ypcart" should be.
# The image is quite wide. Let's find unique colors.
colors = img.getcolors(maxcolors=100000)
dark_colors = [c for c in colors if c[1][0] < 20 and c[1][1] < 20 and c[1][2] < 20]
print("Top 10 darkest colors:", sorted(dark_colors, key=lambda x: x[0], reverse=True)[:10])

