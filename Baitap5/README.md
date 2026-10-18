# Link video thuyết trình:

---

# Ứng dụng Quản lý khóa học (Course Management)

Ứng dụng di động quản lý khóa học trực tuyến, xây dựng bằng **React Native (Expo) + TypeScript**, dùng **MockAPI** làm backend REST.

## Chức năng

- **Danh sách khóa học:** hiển thị ảnh bìa, tên, giảng viên, danh mục, học phí; tìm kiếm theo tên; lọc theo danh mục.
- **Chi tiết khóa học:** xem đầy đủ thông tin, tên danh mục lấy từ API, xem trailer, sửa và xóa khóa học.
- **Thêm / sửa khóa học:** một form dùng chung, có kiểm tra dữ liệu (học phí, thời lượng, URL ảnh và trailer, danh mục).
- **Quản lý danh mục:** thêm, sửa, xóa; không cho xóa danh mục đang có khóa học.
- **Xử lý trạng thái:** hiển thị loading, thông báo lỗi kèm nút "Thử lại", và thông báo khi danh sách rỗng.

## Công nghệ

- React Native, Expo, Expo Router
- TypeScript
- `expo-video` (phát trailer), `@react-native-picker/picker` (chọn danh mục)
- MockAPI (REST API)

## Link MockAPI

```
https://6ace45d2f338359cf1c35f99.mockapi.io/api/v1
```

| Resource | Đường dẫn |
|---|---|
| Danh mục | `/categories` |
| Khóa học | `/courses` |

## Hướng dẫn chạy ứng dụng

### Yêu cầu

- Node.js 18 trở lên
- Ứng dụng **Expo Go** trên điện thoại (hoặc Android emulator)
- Điện thoại và máy tính dùng chung một mạng Wi-Fi

### Các bước

1. Mở terminal tại thư mục `Baitap5`:

```bash
   cd Baitap5
```

2. Cài thư viện:

```bash
   npm install
```

3. Chạy ứng dụng:

```bash
   npx expo start
```

4. Mở app:
   - Quét mã QR bằng **Expo Go** trên điện thoại, hoặc
   - Nhấn phím `a` trong terminal để mở trên Android emulator.

### Đổi đường dẫn MockAPI (nếu dùng project MockAPI khác)

Mở file `src/api.ts` và sửa hằng số `BASE_URL`:

```ts
export const BASE_URL = 'https://<ma-project-cua-ban>.mockapi.io/api/v1';
```

## Cấu trúc thư mục

```
src/
  app/
    _layout.tsx        # Stack navigator
    index.tsx          # Danh sách khóa học
    categories.tsx     # Quản lý danh mục
    course/
      [id].tsx         # Chi tiết khóa học
      form.tsx         # Thêm / sửa khóa học
  api.ts               # Gọi REST API (hàm request dùng chung)
  types.ts             # Kiểu dữ liệu Course, Category
  components/State.tsx # Loading / lỗi / danh sách rỗng
```

## Cấu trúc dữ liệu

**categories:** `id`, `name`, `description`

**courses:** `id`, `title`, `description`, `categoryId`, `instructor`, `price` (số), `duration` (số, giờ), `thumbnail`, `trailerUrl`, `createdAt`

## Lưu ý khi chạy

- Cần kết nối Internet để gọi MockAPI và tải ảnh, video.
- Trailer phải là link file `.mp4` trực tiếp (không dùng link trang YouTube).
