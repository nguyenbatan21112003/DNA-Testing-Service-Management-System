"use client"

import { useState } from "react"
import { Card, Tabs, Button, Space } from "antd"
import { FileTextOutlined, BankOutlined } from "@ant-design/icons"
import AdminSampling from "./AdminSampling"
import CivilSampling from "./CivilSampling"

const { TabPane } = Tabs

const SamplingNavigation = () => {
    const [activeTab, setActiveTab] = useState("admin")

    return (
        <div style={{ padding: 24, background: "#f5f5f5", minHeight: "100%" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#00a67e", margin: 0 }}>Quản lý lấy mẫu xét nghiệm</h1>
                <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: 16 }}>
                    Quản lý lấy mẫu cho cả trường hợp hành chính và dân sự
                </p>
            </div>

            <Card>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    tabBarExtraContent={
                        <Space>
                            <Button
                                type={activeTab === "admin" ? "primary" : "default"}
                                icon={<BankOutlined />}
                                onClick={() => setActiveTab("admin")}
                                style={{
                                    backgroundColor: activeTab === "admin" ? "#722ed1" : undefined,
                                    borderColor: activeTab === "admin" ? "#722ed1" : undefined,
                                }}
                            >
                                Hành chính
                            </Button>
                            <Button
                                type={activeTab === "civil" ? "primary" : "default"}
                                icon={<FileTextOutlined />}
                                onClick={() => setActiveTab("civil")}
                                style={{
                                    backgroundColor: activeTab === "civil" ? "#13c2c2" : undefined,
                                    borderColor: activeTab === "civil" ? "#13c2c2" : undefined,
                                }}
                            >
                                Dân sự
                            </Button>
                        </Space>
                    }
                >
                    <TabPane
                        tab={
                            <span style={{ color: "#722ed1" }}>
                                <BankOutlined />
                                Lấy mẫu hành chính
                            </span>
                        }
                        key="admin"
                    >
                        <AdminSampling />
                    </TabPane>
                    <TabPane
                        tab={
                            <span style={{ color: "#13c2c2" }}>
                                <FileTextOutlined />
                                Lấy mẫu dân sự
                            </span>
                        }
                        key="civil"
                    >
                        <CivilSampling />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    )
}

export default SamplingNavigation
