# Giải thích về topic 2 DNA.docx

Topic 2 : **Bloodline DNA Testing Service Management System**
(Phần mềm quản lý dịch vụ xét nghiệm ADN huyết thống)

I.Tổng quát về project

**A. Mô hình triển khai:**

* Một cơ sở y tế hoặc trung tâm xét nghiệm có giấy phép hoạt động hợp pháp.
* Cung cấp các dịch vụ xét nghiệm ADN huyết thống (cha – con, anh – em, dân sự, hành chính…).
  + Dân sự : tập trung vào tệp khách hàng muốn chứng nhận nhân thân, tìm người thất lạc,…
  + Hành chính : tập trung vào các tệp khách hàng liên quan đến pháp lý ( liên quan mật thiết đến pháp luật), DNA cho các chiến sĩ hi sinh nhưng chưa biết danh tính => Liên quan đến di chúc, phân chia tài sản, chứng nhận người thân, người thừa kế tài sản (cần được pháp luật ràng buộc và thực hiện)
* Có website hoặc ứng dụng để khách hàng tương tác và theo dõi toàn bộ quy trình.

**B. Các Vai Trò và Chức Năng Chính**

### 1. ****Guest (Khách truy cập không đăng nhập)****

* Xem thông tin giới thiệu trung tâm, dịch vụ xét nghiệm ADN.
* Đọc blog chia sẻ kiến thức, hướng dẫn quy trình xét nghiệm.

=> Hướng các khách hàng đang có nhu cầu tìm hiểu và cần nguồn thông tin quan trọng liên quan đến dịch vụ ADN

### 2. ****Customer (Người sử dụng dịch vụ)****

* **Đăng ký dịch vụ xét nghiệm ADN**:
  + Tự thu mẫu tại nhà hoặc yêu cầu nhân viên đến lấy mẫu tại chỗ.
  + Có hai luồng quy trình:
    1. **Tự gửi mẫu**: Đăng ký → Nhận bộ kit → Tự thu → Gửi lại mẫu → Trung tâm xét nghiệm → Nhận kết quả.
    2. **Đặt lịch lấy mẫu tại cơ sở**: Đặt lịch → Nhân viên lấy mẫu → Xét nghiệm → Nhận kết quả.
* **Xem kết quả xét nghiệm trên hệ thống.**
* Đánh giá, phản hồi dịch vụ (rating, feedback).
* Quản lý lịch sử đặt xét nghiệm, hồ sơ cá nhân.

### 3. ****Staff (Nhân viên kỹ thuật/xét nghiệm)****

* Tiếp nhận mẫu từ khách hàng, cập nhật tiến trình xử lý.
* Gắn kết quả xét nghiệm vào đúng hồ sơ khách hàng.
* Theo dõi tiến độ công việc (nhận mẫu, xét nghiệm, trả kết quả).

### 4. ****Manager (Quản lý trung tâm)****

* Theo dõi toàn bộ quy trình từ đặt lịch → lấy mẫu → trả kết quả.
* Phân công công việc, quản lý nhân sự kỹ thuật.
* Giám sát chất lượng dịch vụ, xem thống kê hiệu suất.

### 5. ****Admin (Quản trị hệ thống)****

* Cấu hình các dịch vụ xét nghiệm (tên, loại, giá).
* Quản lý tài khoản người dùng và nhân viên.
* Xuất **báo cáo thống kê**: số ca xét nghiệm, tỷ lệ hoàn thành, đánh giá khách hàng...
* Quản lý feedback, bảo trì hệ thống phần mềm.

II. Lộ trình phát triển dự án:

**A.Những thứ cần thiết trong dự án này:**

### 1. **Đăng ký xét nghiệm ADN**

* Cho phép **Customer** nhập thông tin cá nhân, người cần xét nghiệm.
* Chọn **loại xét nghiệm** (cha – con, mẹ – con, anh – em…).
* Chọn **phương thức lấy mẫu**: tại nhà hoặc đến trung tâm.

### 2. **Theo dõi tiến trình xử lý mẫu**

* Cập nhật các trạng thái theo từng giai đoạn:
  1. Đã đăng ký
  2. Đã nhận mẫu
  3. Đang xét nghiệm
  4. Đã có kết quả
  5. Đã gửi kết quả
* Cập nhật do **Staff** thực hiện, khách hàng được thông báo.

### 3. **Quản lý hồ sơ xét nghiệm**

* **Staff** hoặc **Manager** có thể:
  + Tạo hồ sơ xét nghiệm tương ứng với yêu cầu.
  + Nhập/đính kèm **kết quả xét nghiệm** dưới dạng PDF hoặc văn bản.
  + Gửi kết quả cho khách hàng.

4. Phân quyền

|  |  |
| --- | --- |
| * Customer | : Đăng ký dịch vụ, theo dõi tiến trình, xem kết quả |

|  |  |
| --- | --- |
| * Staff | : Cập nhật trạng thái, nhập kết quả xét nghiệm |

|  |  |
| --- | --- |
| * Manager | : Giám sát quy trình, thống kê số ca, phân công nhân sự |

|  |  |
| --- | --- |
| * Admin | : Cấu hình dịch vụ, quản lý người dùng, xuất báo cáo |

### 5. **Xuất báo cáo thống kê**

* Số ca xét nghiệm theo ngày/tuần/tháng.
* Tỷ lệ hoàn thành – đang xử lý – chưa nhận mẫu.
* Biểu đồ dạng cột, tròn hoặc bảng tổng hợp.

### 6. **Cấu hình hệ thống**

* Cập nhật **danh mục loại xét nghiệm** (tên, thời gian xử lý, chi phí).
* Quản lý **gói dịch vụ** nếu có.
* Quản lý **mẫu email thông báo kết quả**.

### 7. **Đăng nhập & bảo mật thông tin**

* Đăng ký, đăng nhập (Customer/Staff/Admin).
* Phân quyền hiển thị đúng chức năng.
* Kết quả xét nghiệm chỉ được xem bởi người được cấp quyền.

### 8. **Tải và xem kết quả xét nghiệm**

* **Customer** có thể:
  + Nhận thông báo khi có kết quả.
  + Xem kết quả online hoặc tải file (PDF, hình ảnh).
  + Yêu cầu gửi bản cứng nếu cần.
* Staff có thể
  + Chỉnh sửa lại kết quả nếu có xảy ra lỗi
  + Cấp chứng thực về đơn xét nghiệm (nếu cần) dựa trên hình thức pháp lý của luật pháp

### 9. **Hệ thống thông báo (Notification)**

* Gửi thông báo nội hệ thống hoặc email khi:
  + Đăng ký thành công
  + Mẫu được nhận
  + Có kết quả xét nghiệm