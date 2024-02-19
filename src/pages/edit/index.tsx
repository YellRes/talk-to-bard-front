import { useRef, useState } from "react";
import { Cell, Popup, Input, Button } from "react-vant";
import { useModel } from "umi";

import { useEventTargetInAntd } from "@/core/hooks/useInAntd";
import { editUserInfoRequest } from "./api";

export default function EditUserInfo() {
  const { user, setUser } = useModel("userModel");
  const [popupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modifyVal, setModifyVal] = useState("");
  const currentField = useRef<"name" | "email">("name");

  const handleClick = ({ field }: { field: string }) => {
    currentField.current = field as "name" | "email";
    setModifyVal(user![currentField.current] || "");
    setPopupVisible(true);
  };
  const modifyContent = async () => {
    try {
      setLoading(true);
      let res = await editUserInfoRequest({
        ...user,
        [currentField.current]: modifyVal,
      });
      setUser(res);
      setPopupVisible(false);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <>
      <h1 className="h1-primary">编辑信息</h1>
      <Cell
        title="姓名"
        value={user?.name}
        isLink
        onClick={() => handleClick({ field: "name" })}
      />
      <Cell
        title="邮箱"
        value={user?.email}
        isLink
        onClick={() => handleClick({ field: "email" })}
      />

      <Popup
        style={{ height: "30%" }}
        visible={popupVisible}
        position="bottom"
        onClose={() => setPopupVisible(false)}
      >
        <Cell>
          <Input
            placeholder="请输入内容"
            value={modifyVal}
            onChange={(e) => setModifyVal(e)}
            onClear={() => setModifyVal("")}
            suffix={
              <Button
                type="primary"
                size="small"
                onClick={modifyContent}
                loading={loading}
              >
                修改
              </Button>
            }
            clearable
          />
        </Cell>
      </Popup>
    </>
  );
}
