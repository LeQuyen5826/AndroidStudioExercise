# BIT240201_FoodManager

Bài kiểm tra giữa kỳ môn **Phát triển ứng dụng di động** - Đề tài **Quản lý món ăn**.

- **Sinh viên:** Lê Quyền
- **MSSV:** BIT240201
- **Công nghệ:** React Native (Expo) + TypeScript
- **Lưu trữ:** AsyncStorage (local) + MockAPI (REST API)

## 1. Giới thiệu

Ứng dụng quản lý hai đối tượng dữ liệu là loại món ăn (`DishCategory`) và món ăn (`Dish`). Ứng dụng hoạt động được cả khi không có Internet: mọi thay đổi được lưu vào bộ nhớ local, khi có mạng trở lại ứng dụng tự động đồng bộ với MockAPI, không cần bấm nút "Đồng bộ".

## 2. Chức năng

### Chức năng cơ bản

| Nhóm | Nội dung |
|---|---|
| Quản lý món ăn | Danh sách, chi tiết, thêm, sửa, xóa (có hộp thoại xác nhận). Form chọn loại món từ dữ liệu đã lưu |
| Tìm kiếm, lọc, sắp xếp | Tìm theo một phần tên; lọc theo loại, trạng thái đang bán, khoảng giá (kết hợp đồng thời); sắp xếp theo giá tăng/giảm hoặc thời gian chế biến tăng. Bộ lọc được giữ khi quay lại danh sách |
| Ảnh | Thêm ảnh bằng ImageUrl, hiển thị nhiều ảnh ở màn hình chi tiết, đổi ảnh đại diện (tối đa 1 ảnh `IsThumbnail = true`) |
| Thời gian chế biến | Hiển thị "Quick / Nhanh" khi `PreparationTime <= 15`, ngược lại "Regular / Thông thường" (tính lúc hiển thị, không lưu) |
| Validation | `Name` không rỗng; `Price > 0`; `PreparationTime > 0`; `DishCategoryId` hợp lệ; tên món không trùng trong cùng một loại |
| Ràng buộc và xử lý lỗi | Không cho xóa loại món đang được sử dụng; món ngừng bán vẫn hiện trong danh sách nhưng không hiện khi lọc "đang bán"; xử lý Id không tồn tại, danh sách/ảnh trống, khoảng giá không hợp lệ, dữ liệu nhập sai, lỗi truy cập MockAPI |
| Đa ngôn ngữ | Mặc định English, chuyển English ↔ Tiếng Việt bằng nút ở góc phải; áp dụng cho nhãn, nút, trạng thái, thông báo lỗi; giữ ngôn ngữ khi chuyển màn hình và khi mở lại ứng dụng |

### Chức năng nâng cao: offline và tự động đồng bộ

- Khi **offline**: vẫn thêm, sửa, xóa; dữ liệu lưu vào AsyncStorage kèm trạng thái chờ đồng bộ.
- Khi **có mạng trở lại**: tự động đồng bộ giữa local và MockAPI.
- Thanh trạng thái ở cuối màn hình cho biết: Offline, Đang đồng bộ, Đã đồng bộ hoặc Lỗi (tự thử lại sau 10 giây).

## 3. Thiết kế dữ liệu

Toàn bộ tên Table và tên trường dữ liệu có tiền tố `BIT240201_`. MSSV được khai báo duy nhất một chỗ tại `src/config/student.ts`.

### Table `BIT240201_DishCategory`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `BIT240201_Id` | string (UUID) | Khóa logic của ứng dụng |
| `BIT240201_Name` | string | Tên loại món |
| `BIT240201_Description` | string | Mô tả |

### Table `BIT240201_Dish`

| Trường | Kiểu | Mô tả |
|---|---|---|
| `BIT240201_Id` | string (UUID) | Khóa logic của ứng dụng |
| `BIT240201_Name` | string | Tên món |
| `BIT240201_Price` | number | Giá (> 0) |
| `BIT240201_PreparationTime` | number | Thời gian chế biến, phút (> 0) |
| `BIT240201_IsAvailable` | boolean | Đang bán hay ngừng bán |
| `BIT240201_Description` | string | Mô tả |
| `BIT240201_DishCategoryId` | string | Giá trị `BIT240201_Id` của loại món |
| `BIT240201_DishImages` | array | Danh sách ảnh, mỗi phần tử gồm `BIT240201_ImageUrl` (string) và `BIT240201_IsThumbnail` (boolean) |

### Trường chỉ dùng ở local (không gửi lên MockAPI)

`BIT240201_SyncStatus` (`synced`, `pending_create`, `pending_update`, `pending_delete`), `BIT240201_RemoteId` (id do MockAPI cấp), `BIT240201_UpdatedAt`.

> Trường `id` do MockAPI tự cấp là trường hệ thống, không đổi tên được. Khóa logic của ứng dụng là `BIT240201_Id`.

Dữ liệu mẫu tối thiểu: 3 loại món và 5 món ăn, mỗi món thuộc một loại, có món có nhiều ảnh và có món ngừng bán.

## 4. Cấu trúc thư mục

```
BIT240201_FoodManager/
├── App.tsx                      # Providers, nghe thay đổi mạng, banner đồng bộ
└── src/
    ├── config/student.ts        # MSSV, tiền tố, tên Table
    ├── models/index.ts          # Dish, DishCategory, DishImage, Result
    ├── storage/
    │   ├── localStore.ts        # Đọc/ghi AsyncStorage
    │   ├── seed.ts              # Dữ liệu mẫu
    │   └── api.ts               # Gọi MockAPI, chuyển đổi dữ liệu local <-> server
    ├── validation/validate.ts   # Kiểm tra dữ liệu, trả về mã lỗi
    ├── services/
    │   ├── dishService.ts       # CRUD món ăn
    │   ├── categoryService.ts   # CRUD loại món, chặn xóa loại đang dùng
    │   └── syncService.ts       # Tự động đồng bộ local <-> MockAPI
    ├── i18n/                    # Từ điển en/vi và LanguageContext
    ├── context/FilterContext.tsx# Giữ bộ lọc/sắp xếp khi đổi màn hình
    ├── hooks/useSyncState.ts
    ├── components/SyncBanner.tsx
    ├── utils/                   # dish.ts (ảnh, Quick/Regular), filter.ts (lọc, sắp xếp)
    ├── navigation/              # AppNavigator, types
    └── screens/                 # DishList, DishDetail, DishForm
```

Các màn hình không đọc AsyncStorage trực tiếp mà luôn gọi `services`.

## 5. Cơ chế lưu trữ và đồng bộ

1. **Ghi local trước:** mọi thao tác thêm/sửa/xóa ghi vào AsyncStorage và đánh dấu `pending_create`, `pending_update` hoặc `pending_delete`. Giao diện luôn đọc từ local.
2. **Phát hiện mạng:** `@react-native-community/netinfo` lắng nghe trạng thái kết nối. Khi chuyển từ offline sang online, `syncService.runSync()` được gọi tự động.
3. **Đẩy lên server:** các bản ghi đang chờ được gửi lên MockAPI bằng POST, PUT hoặc DELETE. Loại món được đồng bộ trước, món ăn sau.
4. **Chống trùng bản ghi:**
   - Id của bản ghi do ứng dụng tự sinh (UUID), không chờ server cấp.
   - Trước khi tạo, ứng dụng tra `BIT240201_Id` trên MockAPI; nếu đã tồn tại thì cập nhật (PUT) thay vì tạo mới (POST).
   - Cờ `running` không cho hai lượt đồng bộ chạy song song.
5. **Kéo về và gộp:** sau khi đẩy, ứng dụng lấy dữ liệu từ MockAPI và gộp vào local theo `BIT240201_Id`. Bản ghi đang chờ đồng bộ thì dữ liệu local được ưu tiên.

## 6. Cấu hình MockAPI

Base URL được khai báo trong `src/storage/api.ts`:

```
https://6ad71691f71f154ac487bcfe.mockapi.io/api/v1
```

Hai resource: `BIT240201_DishCategory` và `BIT240201_Dish`.

| Thao tác | Phương thức | Đường dẫn |
|---|---|---|
| Danh sách | GET | `/<resource>` |
| Thêm | POST | `/<resource>` |
| Sửa | PUT | `/<resource>/:id` |
| Xóa | DELETE | `/<resource>/:id` |

## 7. Hướng dẫn chạy

Yêu cầu: Node.js, và ứng dụng Expo Go trên điện thoại (hoặc Android emulator).

```bash
npm install
npx expo start -c
```

Quét mã QR bằng Expo Go, hoặc nhấn `a` để mở trên Android emulator. Phiên bản Expo Go cần khớp với SDK của project.

## 8. Hướng dẫn demo offline và đồng bộ

1. Mở ứng dụng khi có mạng, thanh trạng thái hiện "Online - synced".
2. Tắt Wi-Fi/dữ liệu di động, thanh trạng thái chuyển sang "Offline".
3. Thêm một món mới và sửa giá một món cũ. Cả hai vẫn hiển thị và được lưu local.
4. Bật mạng lại, không bấm nút nào: thanh trạng thái chuyển "Đang đồng bộ" rồi "Đã đồng bộ".
5. Mở `<base URL>/BIT240201_Dish` trên trình duyệt: món mới xuất hiện đúng một lần, món cũ đã cập nhật giá.

## 9. Ghi chú

- Ràng buộc "không cho xóa loại món đang được sử dụng" được cài đặt ở lớp `categoryService.deleteCategory`.
- Phần dịch giao diện không áp dụng cho dữ liệu tên và mô tả món do người dùng nhập.
