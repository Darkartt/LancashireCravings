# Git LFS Image Issue

## Problem

Images are not displaying on the deployed website because they are stored using **Git Large File Storage (LFS)** but the LFS files haven't been pulled/resolved.

### Evidence

```bash
$ ls -lh public/*.jpg | head -5
-rw-r--r-- 1 root root 130 Nov  8 14:32 public/BarOwlBack.jpg
-rw-r--r-- 1 root root 131 Nov  8 14:32 public/Crow.jpg
-rw-r--r-- 1 root root 131 Nov  8 14:32 public/Dog.jpg
```

These files are only 130-131 bytes - they're Git LFS pointer files, not actual images.

```bash
$ cat public/Dog.jpg
version https://git-lfs.github.com/spec/v1
oid sha256:498355130c178f7391414cd9678c31711f9723e51d2548fbd37711719295f8f9
size 320309
```

The actual image is 320KB, but only the LFS pointer file (130 bytes) is present.

## Solution Options

### Option 1: Install Git LFS and Pull Images (Recommended)

**On your local machine**:

```bash
# Install Git LFS
# macOS
brew install git-lfs

# Ubuntu/Debian
sudo apt-get install git-lfs

# Windows
# Download from: https://git-lfs.github.com/

# Initialize Git LFS
git lfs install

# Pull all LFS files
git lfs pull

# Verify images are now real
ls -lh public/*.jpg | head -5
# Should now show files in KB/MB range

# Commit and push
git add public/
git commit -m "fix: pull Git LFS images"
git push
```

### Option 2: Configure Deployment to Use Git LFS

**GitHub Pages**:

GitHub Pages should automatically handle LFS files, but you may need to:

1. Ensure your GitHub Actions workflow includes LFS:

```yaml
- uses: actions/checkout@v3
  with:
    lfs: true  # Add this line

- name: Checkout LFS objects
  run: git lfs pull  # Add this step
```

**Vercel/Netlify**:

Most modern deployment platforms auto-handle Git LFS. If not, add to build command:

```bash
# package.json
{
  "scripts": {
    "prebuild": "git lfs pull",
    "build": "next build"
  }
}
```

### Option 3: Temporarily Use Placeholder Images

We've created `ImageWithFallback` component that shows nice placeholders when images fail to load:

```tsx
import { ImageWithFallback } from "@/components/ui/image-with-fallback";

<ImageWithFallback
  src="/Dog.jpg"
  alt="Dog carving"
  fill
  className="object-cover"
/>
```

This shows a gradient placeholder with an icon when the image can't load.

## Implementation Status

✅ **ImageWithFallback component created** (`src/components/ui/image-with-fallback.tsx`)
- Automatically shows placeholders for missing images
- Displays loading state
- Gracefully handles image load failures

❌ **Git LFS files not pulled** in current environment
- Git LFS is not installed in this environment
- Images remain as 130-byte pointer files
- Will not display on deployed site until LFS is resolved

## Recommendations

### Immediate (Do This First):

```bash
# On your local development machine
git lfs install
git lfs pull
ls -lh public/  # Verify images are now larger
git status      # Should show modified files
git add public/
git commit -m "fix: pull Git LFS image files"
git push origin main
```

### Long-term:

1. **Document LFS requirement** in README for future developers
2. **Update CI/CD** to include `lfs: true` in checkout steps
3. **Consider alternatives**:
   - Move to a CDN (Cloudinary, Imgix) for better performance
   - Use Next.js Image Optimization API (requires server)
   - Store smaller web-optimized versions directly in git

## Affected Files

All images in `/public/` are LFS files:

- Portfolio images: `/public/portfolio/**/*.jpg`
- Social media images: `/public/*.jpg`
- Texture images: `/public/*_grain.jpeg`

**Total affected**: ~50+ image files

## Testing

After pulling LFS files, verify:

```bash
# Check file sizes are correct
ls -lh public/*.jpg

# Build should work
npm run build

# Test locally
npm run dev
# Visit http://localhost:3000 and verify images load
```

## Resources

- [Git LFS Documentation](https://git-lfs.github.com/)
- [GitHub LFS Guide](https://docs.github.com/en/repositories/working-with-files/managing-large-files)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
