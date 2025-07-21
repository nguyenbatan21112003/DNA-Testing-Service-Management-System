import {
  Send,
  Droplet,
  FlaskRoundIcon as Flask,
  FileText,
  CheckCircle,
} from "lucide-react";

const TestingProcess = () => {
  const steps = [
    {
      id: 1,
      title: "Đăng ký và gửi mẫu, gửi đơn",
      description:
        "Đăng ký xét nghiệm trực tuyến hoặc qua phòng khám và gửi mẫu xét nghiệm theo hướng dẫn.",
      icon: <Send className="process-icon" />,
    },
    {
      id: 2,
      title: "Thu thập mẫu",
      description:
        "Mẫu xét nghiệm được thu thập bằng phương pháp đặc biệt trước khi chuyển đến phòng thí nghiệm của chúng tôi.",
      icon: <Droplet className="process-icon" />,
    },
    {
      id: 3,
      title: "Phân tích trong phòng thí nghiệm",
      description:
        "Mẫu được phân tích bởi các chuyên gia sử dụng công nghệ tiên tiến nhất.",
      icon: <Flask className="process-icon" />,
    },
    {
      id: 4,
      title: "Kết quả và báo cáo",
      description:
        "Kết quả xét nghiệm được gửi email hoặc có thể nhận trực tiếp tại phòng khám.",
      icon: <FileText className="process-icon" />,
    },
    {
      id: 5,
      title: "Tư vấn sau xét nghiệm",
      description:
        "Đội ngũ chuyên gia của chúng tôi sẵn sàng giải đáp mọi thắc mắc về kết quả xét nghiệm.",
      icon: <CheckCircle className="process-icon" />,
    },
  ];

  return (
    <section className="testing-process">
      <div className="container">
        <h2>Quy trình xét nghiệm</h2>
        <p className="section-description">
          Quy trình xét nghiệm ADN của chúng tôi được thiết kế để đảm bảo kết
          quả chính xác và bảo mật.
        </p>

        <div className="process-steps">
          {steps.map((step) => (
            <div className="process-step" key={step.id}>
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestingProcess;
