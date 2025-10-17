package barbosa.guilherme.backend.mapper;

import barbosa.guilherme.backend.model.User;
import barbosa.guilherme.backend.requests.UserPostRequestBody;
import barbosa.guilherme.backend.requests.UserPutRequestBody;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper((UserMapper.class));

    User toUser(UserPostRequestBody userPostRequestBody);
    User toUser(UserPutRequestBody userPutRequestBody);
}
